
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const { BOT_TOKEN } = require('../utils/telegramConfig');

// Initialize the bot with your token
const bot = new Telegraf(BOT_TOKEN);

// Log when the bot starts
console.log('Starting Telegram bot server...');

// Command handlers
bot.start((ctx) => {
  console.log('Received /start command');
  ctx.reply('👋 Welcome to the Gatekeeper Bot! Type /help to see available commands.');
});

bot.help((ctx) => {
  console.log('Received /help command');
  ctx.reply(`📋 Available commands:
/start - Start the bot
/help - Show this help message
/status - Check your authorization status
/time - Show current server time

📥 Download Commands:
/youtube [url] - Download from YouTube
/instagram [url] - Download from Instagram
/tiktok [url] - Download from TikTok`);
});

bot.command('status', (ctx) => {
  console.log('Received /status command');
  ctx.reply('🔄 Checking your authorization status...\n\n✅ You are authorized to use this bot!');
});

bot.command('time', (ctx) => {
  console.log('Received /time command');
  ctx.reply(`🕒 Current server time: ${new Date().toLocaleTimeString()}`);
});

// YouTube download command
bot.command('youtube', (ctx) => {
  const args = ctx.message.text.split(' ');
  const url = args.length > 1 ? args[1] : null;
  
  if (!url) {
    return ctx.reply('⚠️ Please provide a YouTube URL. Usage: /youtube [url]');
  }
  
  console.log(`Received YouTube download request: ${url}`);
  ctx.reply(`🎥 Processing YouTube download: ${url}`);
  
  // Simulate download progress
  let progress = 0;
  const progressMessage = ctx.reply('📥 Starting download...');
  
  const interval = setInterval(async () => {
    progress += 10;
    if (progress <= 100) {
      const progressBar = Array(10).fill('▱').map((char, i) => i < Math.floor(progress / 10) ? '▰' : char).join('');
      await ctx.telegram.editMessageText(
        ctx.chat.id, 
        (await progressMessage).message_id, 
        undefined, 
        `🎥 Downloading from YouTube: ${progressBar} ${progress}%`
      );
    } else {
      clearInterval(interval);
      await ctx.telegram.editMessageText(
        ctx.chat.id, 
        (await progressMessage).message_id, 
        undefined, 
        '✅ Download complete!'
      );
      
      ctx.reply(`🎥 YouTube download completed:
🎬 Title: Sample YouTube Video
⏱️ Length: 5:23
📝 Quality: 1080p
📦 Size: 45 MB
🔗 Source: ${url}`);
    }
  }, 1000);
});

// Instagram download command
bot.command('instagram', (ctx) => {
  const args = ctx.message.text.split(' ');
  const url = args.length > 1 ? args[1] : null;
  
  if (!url) {
    return ctx.reply('⚠️ Please provide an Instagram URL. Usage: /instagram [url]');
  }
  
  console.log(`Received Instagram download request: ${url}`);
  ctx.reply(`📸 Processing Instagram download for: ${url}`);
  
  // Simulate processing
  setTimeout(() => {
    ctx.reply(`📸 Instagram post downloaded:
👤 User: @sample_user
📦 Size: 12 MB
🔗 Source: ${url}`);
  }, 3000);
});

// TikTok download command
bot.command('tiktok', (ctx) => {
  const args = ctx.message.text.split(' ');
  const url = args.length > 1 ? args[1] : null;
  
  if (!url) {
    return ctx.reply('⚠️ Please provide a TikTok URL. Usage: /tiktok [url]');
  }
  
  console.log(`Received TikTok download request: ${url}`);
  ctx.reply(`🎵 Processing TikTok download for: ${url}`);
  
  // Simulate processing
  setTimeout(() => {
    ctx.reply(`🎵 TikTok video downloaded:
👤 Creator: @tiktok_user
⏱️ Duration: 30 seconds
👁️ Views: 45,000
📦 Size: 8 MB
🔗 Source: ${url}`);
  }, 2500);
});

// Handle unknown commands
bot.on('text', (ctx) => {
  console.log(`Received message: ${ctx.message.text}`);
  
  if (ctx.message.text.startsWith('/')) {
    ctx.reply('⚠️ Unknown command. Type /help to see available commands.');
  }
});

// Start the bot
bot.launch()
  .then(() => {
    console.log('Bot started successfully!');
    console.log(`Bot username: ${bot.botInfo.username}`);
  })
  .catch((err) => {
    console.error('Failed to start bot:', err);
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
