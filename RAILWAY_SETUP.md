# Railway Deployment Guide

This guide will help you deploy your Telegram Camera Bot to Railway.

## Prerequisites

- A Railway account (sign up at [railway.app](https://railway.app))
- Your Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- Your Telegram User ID

## Deployment Steps

### 1. Prepare Your Repository

Make sure all changes are committed to your Git repository:

```bash
git add .
git commit -m "Configure for Railway webhook deployment"
git push
```

### 2. Create a New Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect it as a Node.js project

### 3. Configure Environment Variables

In your Railway project dashboard, go to the **Variables** tab and add the following:

#### Required Variables:

```
BOT_TOKEN=your_bot_token_here
YOUR_TELEGRAM_ID=your_telegram_user_id_here
USE_WEBHOOK=true
```

#### Optional Variables:

```
BITLY_TOKEN=your_bitly_token_here
PORT=3000
```

**Important:** Railway will automatically provide a `RAILWAY_PUBLIC_DOMAIN` variable. The bot will use this for the webhook URL.

### 4. Set the Webhook URL

After deployment, Railway will provide you with a public URL (e.g., `https://your-app.up.railway.app`).

Add this as an environment variable:

```
WEBHOOK_URL=https://your-app.up.railway.app
```

Or if Railway provides `RAILWAY_PUBLIC_DOMAIN`, use:

```
WEBHOOK_URL=https://${RAILWAY_PUBLIC_DOMAIN}
```

### 5. Deploy

Railway will automatically deploy your application. You can monitor the deployment in the **Deployments** tab.

### 6. Verify Deployment

1. Check the deployment logs to ensure the webhook was set successfully
2. Look for the message: `Webhook ingesteld op: https://your-app.up.railway.app/bot<token>`
3. Send `/start` to your bot on Telegram to test

## Switching Between Webhook and Polling

### For Production (Railway):
Set `USE_WEBHOOK=true` in environment variables

### For Local Development:
- Either don't set `USE_WEBHOOK` (defaults to polling)
- Or set `USE_WEBHOOK=false`

## Troubleshooting

### Error: "Free plan deployments must be serverless"

**Solution:** Make sure `USE_WEBHOOK=true` is set in your Railway environment variables. The bot automatically detects Railway environment and enables webhook mode.

### Bot Not Responding

1. **Check the logs** in Railway dashboard
2. **Verify environment variables** are set correctly
3. **Test the webhook endpoint** by visiting:
   ```
   https://your-app.up.railway.app/health
   ```
4. **Check webhook status** on Telegram:
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
   ```

### Webhook Setup Failed

If you see "Fout bij instellen webhook" in the logs:

1. Make sure `WEBHOOK_URL` is set correctly
2. The URL must be HTTPS (Railway provides this automatically)
3. The URL must be publicly accessible
4. Restart the deployment after fixing

### How to Reset Webhook

If you need to switch back to polling or reset the webhook:

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook
```

Then redeploy with the correct `USE_WEBHOOK` setting.

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `BOT_TOKEN` | Yes | Your Telegram bot token from @BotFather | `123456:ABC-DEF1234...` |
| `YOUR_TELEGRAM_ID` | Yes | Your Telegram user ID | `123456789` |
| `USE_WEBHOOK` | No | Enable webhook mode (auto-detected on Railway) | `true` |
| `WEBHOOK_URL` | No | Public URL for webhook (uses Railway domain if not set) | `https://your-app.up.railway.app` |
| `BITLY_TOKEN` | No | Bit.ly API token for URL shortening | `your_bitly_token` |
| `PORT` | No | Server port (Railway sets this automatically) | `3000` |
| `PUBLIC_URL` | No | Base URL for the application | `https://your-app.up.railway.app` |

## Cost Considerations

- Railway free tier includes 500 hours per month
- Webhook mode is more efficient than polling for free tier
- The bot will automatically sleep when inactive

## Next Steps

- Monitor your bot's usage in the Railway dashboard
- Set up alerts for deployment failures
- Consider upgrading to Railway Pro if you exceed free tier limits

## Support

If you encounter issues:

1. Check Railway deployment logs
2. Review Telegram bot logs: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
3. Ensure all environment variables are correctly set
4. Verify your bot token is valid

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [node-telegram-bot-api Documentation](https://github.com/yagop/node-telegram-bot-api)