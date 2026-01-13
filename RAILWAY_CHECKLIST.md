# 🚂 Railway Deployment Checklist

Quick checklist to deploy your Telegram Camera Bot to Railway without errors.

## ✅ Pre-Deployment Checklist

### 1. Bot Setup
- [ ] Created bot via [@BotFather](https://t.me/BotFather)
- [ ] Saved bot token (format: `123456789:ABC-DEF...`)
- [ ] Got your Telegram user ID from [@userinfobot](https://t.me/userinfobot)

### 2. Code Ready
- [ ] All changes committed to Git
- [ ] Pushed latest changes to GitHub
- [ ] Files present:
  - [ ] `server.js` (with webhook support)
  - [ ] `railway.json`
  - [ ] `Procfile`
  - [ ] `package.json`

### 3. Railway Account
- [ ] Created account at [railway.app](https://railway.app)
- [ ] Connected GitHub account
- [ ] Verified email (if required)

## 🚀 Deployment Steps

### Step 1: Create Railway Project
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your bot repository
- [ ] Wait for Railway to detect Node.js

### Step 2: Configure Environment Variables
Go to your project → **Variables** tab and add:

#### Required:
- [ ] `BOT_TOKEN` = `your_bot_token_from_botfather`
- [ ] `YOUR_TELEGRAM_ID` = `your_telegram_user_id`
- [ ] `USE_WEBHOOK` = `true`

#### After First Deploy (Railway generates domain):
- [ ] `WEBHOOK_URL` = `https://your-app-name.up.railway.app`
  - Get this from the Railway dashboard under "Settings" → "Domains"
  - Or Railway might auto-set `RAILWAY_PUBLIC_DOMAIN` - check logs

#### Optional:
- [ ] `BITLY_TOKEN` = `your_bitly_api_token` (for URL shortening)

### Step 3: Generate Public Domain
- [ ] Go to **Settings** tab
- [ ] Click "Generate Domain" button
- [ ] Copy the generated URL (e.g., `https://abc123.up.railway.app`)
- [ ] Add this as `WEBHOOK_URL` environment variable

### Step 4: Deploy
- [ ] Railway automatically starts building
- [ ] Monitor build in **Deployments** tab
- [ ] Wait for "Success" status (usually 1-2 minutes)

### Step 5: Verify Logs
Check deployment logs for these messages:
- [ ] `📸 Telegram Camera Bot gestart!`
- [ ] `Mode: Webhook`
- [ ] `Webhook ingesteld op: https://your-app.up.railway.app/bot<token>`
- [ ] `✓ Bot is klaar voor gebruik!`

### Step 6: Test Bot
- [ ] Open Telegram
- [ ] Search for your bot username
- [ ] Send `/start` command
- [ ] Bot should respond with a camera link
- [ ] Click link to test camera functionality

## 🔧 Troubleshooting

### ❌ Error: "Free plan deployments must be serverless"
**Solution:**
- [ ] Set `USE_WEBHOOK=true` in Railway environment variables
- [ ] Redeploy the application

### ❌ Bot Not Responding
**Check:**
- [ ] All environment variables are set correctly
- [ ] Bot token is valid (test on Telegram)
- [ ] Webhook URL is set and accessible
- [ ] Check logs for errors

**Verify webhook:**
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```
Should show:
```json
{
  "url": "https://your-app.up.railway.app/bot<token>",
  "has_custom_certificate": false,
  "pending_update_count": 0
}
```

### ❌ Build Failed
**Check:**
- [ ] `package.json` has correct dependencies
- [ ] Node.js version compatible (>=16.x)
- [ ] No syntax errors in `server.js`

### ❌ Webhook Setup Failed
**Solutions:**
- [ ] Make sure `WEBHOOK_URL` points to your Railway domain
- [ ] URL must be HTTPS (Railway provides this)
- [ ] URL must be publicly accessible
- [ ] Restart deployment after fixing

## 🔄 Redeployment

If you need to redeploy:
- [ ] Make code changes locally
- [ ] Commit and push to GitHub
- [ ] Railway auto-deploys (or click "Redeploy" in dashboard)
- [ ] Check logs again

## 📊 Post-Deployment Monitoring

### Daily/Weekly:
- [ ] Check Railway usage dashboard
- [ ] Monitor free tier hours (500/month on free plan)
- [ ] Review deployment logs for errors
- [ ] Test bot functionality

### When Issues Occur:
- [ ] Check Railway service status
- [ ] Review recent deployments
- [ ] Check environment variables
- [ ] Verify Telegram bot token hasn't expired

## 💡 Best Practices

- [ ] Use environment variables for ALL sensitive data
- [ ] Never commit `.env` file to Git
- [ ] Keep bot token secret
- [ ] Monitor Railway usage to avoid exceeding free tier
- [ ] Set up custom domain (optional, Railway Pro)
- [ ] Enable Railway notifications for deployment failures

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Railway shows "Success" status
- ✅ Logs show "Webhook ingesteld op: ..."
- ✅ Bot responds to `/start` command
- ✅ Camera link works when clicked
- ✅ Photos are received in Telegram
- ✅ `/health` endpoint returns `{"status":"ok"}`

## 📚 Additional Resources

- [RAILWAY_SETUP.md](RAILWAY_SETUP.md) - Detailed setup guide
- [DEPLOYMENT_CHANGES.md](DEPLOYMENT_CHANGES.md) - What changed in the code
- [README.md](README.md) - Full project documentation
- [Railway Docs](https://docs.railway.app/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🆘 Need Help?

1. Review [RAILWAY_SETUP.md](RAILWAY_SETUP.md) troubleshooting section
2. Check Railway deployment logs
3. Verify webhook info: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
4. Test health endpoint: `https://your-app.up.railway.app/health`
5. Check Railway community forums

---

**Last Updated:** January 2026  
**Bot Version:** 2.0.0 (Webhook Support)