# 🚀 Quick Railway Deployment (5 Minutes)

Get your Telegram Camera Bot running on Railway in 5 minutes!

## Prerequisites

✅ Telegram bot token from [@BotFather](https://t.me/BotFather)  
✅ Your Telegram user ID from [@userinfobot](https://t.me/userinfobot)  
✅ Code pushed to GitHub  
✅ Railway account (free at [railway.app](https://railway.app))

---

## Step 1: Push Code to GitHub (1 minute)

```bash
cd "telegram bot"
git add .
git commit -m "Add Railway webhook support"
git push
```

---

## Step 2: Deploy to Railway (2 minutes)

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Wait for detection... ✨

---

## Step 3: Set Environment Variables (1 minute)

In Railway dashboard → **Variables** tab, add:

```
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrs
YOUR_TELEGRAM_ID=987654321
USE_WEBHOOK=true
```

Click **"Add"** for each variable.

---

## Step 4: Generate Domain (30 seconds)

1. Go to **Settings** tab
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://abc123.up.railway.app`)
4. Go back to **Variables** tab
5. Add: `WEBHOOK_URL=https://abc123.up.railway.app`

---

## Step 5: Deploy & Test (30 seconds)

Railway auto-deploys. Check **Deployments** tab for:

```
✓ Build successful
✓ Deployed
```

Open Telegram → Search for your bot → Send `/start` → Done! 🎉

---

## Quick Verification

### Check Health Endpoint
Visit: `https://your-app.up.railway.app/health`

Should return:
```json
{"status":"ok","activeSessions":0,"uptime":123}
```

### Check Webhook Status
```bash
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
```

Should show your Railway URL.

### Test Bot
1. Open your bot in Telegram
2. Send `/start`
3. Click the camera link
4. Allow camera access
5. Photo sent to you! 📸

---

## ⚠️ Common Issues

### Error: "Free plan deployments must be serverless"
**Fix:** Make sure `USE_WEBHOOK=true` is set in Variables tab.

### Bot not responding
**Fix:** 
1. Check all 4 environment variables are set
2. Verify bot token is correct
3. Check deployment logs for errors

### Webhook not working
**Fix:**
1. Regenerate domain in Railway
2. Update `WEBHOOK_URL` variable
3. Redeploy

---

## Environment Variables Summary

| Variable | Example | Required |
|----------|---------|----------|
| `BOT_TOKEN` | `123456:ABC-DEF...` | ✅ Yes |
| `YOUR_TELEGRAM_ID` | `123456789` | ✅ Yes |
| `USE_WEBHOOK` | `true` | ✅ Yes (Railway) |
| `WEBHOOK_URL` | `https://your-app.up.railway.app` | ✅ Yes (Railway) |
| `BITLY_TOKEN` | `your_token` | ⚪ Optional |

---

## What Happens Next?

✅ Bot runs 24/7 on Railway  
✅ Auto-restarts if crashes  
✅ 500 hours/month on free tier  
✅ HTTPS enabled automatically  
✅ Webhook mode (efficient)  

---

## Local Development

Want to test locally? Just run:

```bash
npm install
npm start
```

Bot automatically uses **polling mode** for local development (no webhook needed).

---

## Need More Help?

📚 **Detailed Guide:** [RAILWAY_SETUP.md](RAILWAY_SETUP.md)  
📋 **Full Checklist:** [RAILWAY_CHECKLIST.md](RAILWAY_CHECKLIST.md)  
🔧 **What Changed:** [DEPLOYMENT_CHANGES.md](DEPLOYMENT_CHANGES.md)  
📖 **Full Docs:** [README.md](README.md)  

---

## Success! 🎉

Your bot is now live on Railway. Share the camera links and start pranking! 📸

**Pro Tip:** Monitor your Railway usage dashboard to ensure you stay within the free tier limits.

---

**Deployment Time:** ~5 minutes  
**Cost:** FREE (Railway free tier)  
**Uptime:** 24/7  
**Auto-deploys:** On every git push