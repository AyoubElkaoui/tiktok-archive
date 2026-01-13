# 🚀 QUICK START - Telegram Prank Camera Bot

## Stap voor Stap in 5 Minuten

### 1️⃣ Maak Telegram Bot aan

Open **Telegram** en ga naar **@BotFather**:

```
/newbot
```

- Geef een naam: bijv. "Prank Camera Bot"
- Geef een username: bijv. "mycamera_prank_bot"
- **Kopieer de token** die je krijgt!

### 2️⃣ Haal je Telegram ID op

Ga in Telegram naar **@userinfobot**:

```
/start
```

- **Noteer je User ID nummer**

### 3️⃣ Installeer de Code

```bash
cd "telegram bot"
npm install
```

### 4️⃣ Configureer .env

```bash
cp .env.example .env
```

Open `.env` en vul in:

```
BOT_TOKEN=plak_hier_je_bot_token
YOUR_TELEGRAM_ID=plak_hier_je_user_id
PORT=3000
PUBLIC_URL=http://localhost:3000
```

### 5️⃣ Start de Bot

```bash
npm start
```

Je ziet:

```
==================================================
📸 Telegram Camera Bot gestart!
==================================================
✓ Bot is klaar voor gebruik!
```

### 6️⃣ Test het!

1. Open je bot in Telegram (zoek op username)
2. Stuur: `/start`
3. Je krijgt een link
4. Open link op je telefoon
5. Geef camera toestemming
6. **GEPRANKT!** 😂
7. Foto komt binnen in je Telegram! ✅

---

## 🌐 Online Zetten (voor echte pranks)

Voor gebruik buiten localhost heb je een publieke URL nodig.

### Optie A: Ngrok (Makkelijkst)

1. Download [ngrok](https://ngrok.com)
2. Run: `ngrok http 3000`
3. Kopieer de `https://....ngrok.io` URL
4. Update `PUBLIC_URL` in `.env`
5. Herstart bot: `npm start`

### Optie B: VPS/Server

Upload naar je server en gebruik je domein in `PUBLIC_URL`.

**Belangrijk:** Camera werkt alleen op **HTTPS** (niet HTTP)!

---

## 💡 Tips

- Elke link werkt maar **1 keer**
- Links verlopen na **30 minuten**
- Stuur `/nieuw` voor nieuwe link
- Werkt op iOS, Android, Chrome, Safari, etc.
- "GEPRANKT!" verschijnt direct na foto

## 🐛 Problemen?

- **Bot reageert niet?** → Check BOT_TOKEN in .env
- **Foto komt niet aan?** → Check YOUR_TELEGRAM_ID in .env
- **Link werkt niet?** → Gebruik HTTPS in productie (ngrok)
- **Camera toegang geweigerd?** → Gebruiker moet handmatig toestemming geven

---

**Veel plezier met pranken! 😎📸**