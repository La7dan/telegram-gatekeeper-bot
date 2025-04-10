
# Telegram Bot Server

This is a Telegram bot server implementation that connects to the Telegram API using the Telegraf library and supports actual file downloads and uploads.

## Setup Instructions

1. Make sure you have Node.js installed (version 14 or above recommended)

2. Install the required dependencies:
```bash
npm install telegraf dotenv axios ytdl-core file-type fluent-ffmpeg tiktok-scraper
```

3. The bot uses the BOT_TOKEN from your telegramConfig.js file. Replace "YOUR_BOT_TOKEN_HERE" with a valid token from BotFather.

4. Run the bot:
```bash
node src/bot/server.js
```

## Available Commands

- `/start` - Start the bot
- `/help` - Show help message
- `/status` - Check authorization status
- `/time` - Show current server time
- `/youtube [url]` - Download video from YouTube and send it to you
- `/instagram [url]` - Download media from Instagram (direct media links only)
- `/tiktok [url]` - Download video from TikTok (now supports regular TikTok share URLs)

## Important Notes

- This is a separate server from your React application
- The bot needs to be running for your Telegram bot to respond to messages
- The bot can now download actual files and send them to users via Telegram
- Downloaded files are temporarily stored in a 'downloads' directory and then deleted after sending
- For Instagram, currently only direct media URLs are supported
- TikTok downloads now work with regular share URLs (like https://vt.tiktok.com/...)
- YouTube downloads are fully supported with video info extraction
- To deploy this bot, you'll need a server that can run Node.js applications
- In a production environment, consider using a service like Heroku, Vercel, or a dedicated VPS

## Limitations

- Instagram downloads still require direct media URLs due to their restrictions
- Large files may take time to download and send
- Telegram has file size limits (typically 50MB for normal bots)
