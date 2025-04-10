
# Telegram Bot Server

This is a simple Telegram bot server implementation that connects to the Telegram API using the Telegraf library.

## Setup Instructions

1. Make sure you have Node.js installed (version 14 or above recommended)

2. Install the required dependencies:
```bash
npm install telegraf dotenv
```

3. The bot uses the BOT_TOKEN from your telegramConfig.ts file

4. Run the bot:
```bash
node server.js
```

## Available Commands

- `/start` - Start the bot
- `/help` - Show help message
- `/status` - Check authorization status
- `/time` - Show current server time
- `/youtube [url]` - Download from YouTube (simulation)
- `/instagram [url]` - Download from Instagram (simulation)
- `/tiktok [url]` - Download from TikTok (simulation)

## Important Notes

- This is a separate server from your React application
- The bot needs to be running for your Telegram bot to respond to messages
- To deploy this bot, you'll need a server that can run Node.js applications
- In a production environment, consider using a service like Heroku, Vercel, or a dedicated VPS
