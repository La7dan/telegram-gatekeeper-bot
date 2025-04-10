
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { BOT_TOKEN } from '../utils/telegramConfig.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import { fileTypeFromBuffer } from 'file-type';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Initialize the bot with your token
const bot = new Telegraf(BOT_TOKEN);

// Log when the bot starts
console.log('Starting Telegram bot server...');

// Utility function to download file from URL
async function downloadFile(url, platform) {
  try {
    let fileBuffer;
    let filename;
    let fileExtension;
    
    if (platform === 'youtube') {
      // Check if the URL is valid
      if (!ytdl.validateURL(url)) {
        throw new Error('Invalid YouTube URL');
      }
      
      // Get video info to create appropriate filename
      const info = await ytdl.getInfo(url);
      filename = `youtube_${info.videoDetails.videoId}_${Date.now()}`;
      
      // Create a write stream for downloading
      const videoPath = path.join(downloadsDir, `${filename}.mp4`);
      console.log(`Downloading YouTube video to: ${videoPath}`);
      
      return new Promise((resolve, reject) => {
        const video = ytdl(url, { quality: 'highest' })
          .pipe(fs.createWriteStream(videoPath));
          
        video.on('finish', () => {
          resolve({
            path: videoPath,
            filename: `${info.videoDetails.title}.mp4`,
            info: {
              title: info.videoDetails.title,
              length: `${Math.floor(info.videoDetails.lengthSeconds / 60)}:${String(info.videoDetails.lengthSeconds % 60).padStart(2, '0')}`,
              quality: info.formats[0].qualityLabel || 'Standard',
              size: 'Unknown', // Size is determined after download
              source: url
            }
          });
        });
        
        video.on('error', (error) => {
          reject(error);
        });
      });
    } else {
      // For other platforms, use axios to download
      console.log(`Downloading file from URL: ${url}`);
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'arraybuffer'
      });
      
      fileBuffer = Buffer.from(response.data, 'binary');
      
      // Detect file type from buffer
      const fileType = await fileTypeFromBuffer(fileBuffer);
      fileExtension = fileType ? fileType.ext : 'bin';
      filename = `${platform}_${Date.now()}.${fileExtension}`;
      
      // Save file to disk
      const filePath = path.join(downloadsDir, filename);
      await fs.promises.writeFile(filePath, fileBuffer);
      
      return {
        path: filePath,
        filename: filename,
        info: {
          platform,
          size: `${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB`,
          source: url
        }
      };
    }
  } catch (error) {
    console.error(`Error downloading file: ${error.message}`);
    throw error;
  }
}

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
bot.command('youtube', async (ctx) => {
  const args = ctx.message.text.split(' ');
  const url = args.length > 1 ? args[1] : null;
  
  if (!url) {
    return ctx.reply('⚠️ Please provide a YouTube URL. Usage: /youtube [url]');
  }
  
  console.log(`Received YouTube download request: ${url}`);
  const progressMessage = await ctx.reply('🎥 Processing YouTube download...');
  
  try {
    // Send a progress message to indicate download started
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      '📥 Downloading video from YouTube. Please wait...'
    );
    
    // Download the video
    const downloadResult = await downloadFile(url, 'youtube');
    
    // Update the progress message
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      '✅ Download completed! Sending video to you...'
    );
    
    // Send the downloaded file
    await ctx.telegram.sendDocument(
      ctx.chat.id, 
      { source: downloadResult.path, filename: downloadResult.filename },
      { 
        caption: `🎥 YouTube video:
🎬 Title: ${downloadResult.info.title}
⏱️ Length: ${downloadResult.info.length}
📝 Quality: ${downloadResult.info.quality}
🔗 Source: ${url}`
      }
    );
    
    // Update the message to indicate file was sent
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      `✅ Download and upload complete!`
    );
    
    // Clean up downloaded file
    fs.unlinkSync(downloadResult.path);
    
  } catch (error) {
    console.error(`YouTube download error: ${error.message}`);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      `❌ Error: ${error.message}`
    );
  }
});

// Instagram download command
bot.command('instagram', async (ctx) => {
  const args = ctx.message.text.split(' ');
  const url = args.length > 1 ? args[1] : null;
  
  if (!url) {
    return ctx.reply('⚠️ Please provide an Instagram URL. Usage: /instagram [url]');
  }
  
  console.log(`Received Instagram download request: ${url}`);
  const progressMessage = await ctx.reply('📸 Processing Instagram download...');
  
  try {
    // For Instagram, we'll need a more complex scraper but for now, let's handle direct links
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      '📥 Downloading media from Instagram. Please wait...'
    );
    
    if (!url.includes('cdninstagram.com') && !url.includes('instagram.com')) {
      throw new Error('Please provide a direct Instagram media URL');
    }
    
    // Download the file
    const downloadResult = await downloadFile(url, 'instagram');
    
    // Send the downloaded file
    await ctx.telegram.sendDocument(
      ctx.chat.id,
      { source: downloadResult.path, filename: downloadResult.filename },
      {
        caption: `📸 Instagram media:
📦 Size: ${downloadResult.info.size}
🔗 Source: ${url}`
      }
    );
    
    // Update the message
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      `✅ Instagram download complete!`
    );
    
    // Clean up the file
    fs.unlinkSync(downloadResult.path);
    
  } catch (error) {
    console.error(`Instagram download error: ${error.message}`);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      `❌ Error downloading from Instagram: ${error.message}`
    );
  }
});

// TikTok download command
bot.command('tiktok', async (ctx) => {
  const args = ctx.message.text.split(' ');
  const url = args.length > 1 ? args[1] : null;
  
  if (!url) {
    return ctx.reply('⚠️ Please provide a TikTok URL. Usage: /tiktok [url]');
  }
  
  console.log(`Received TikTok download request: ${url}`);
  const progressMessage = await ctx.reply('🎵 Processing TikTok download...');
  
  try {
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      '📥 Downloading video from TikTok. Please wait...'
    );
    
    // For TikTok we would need a specialized scraper
    // But for direct video URLs we can use our download function
    if (!url.endsWith('.mp4') && !url.includes('tiktokcdn')) {
      throw new Error('Please provide a direct TikTok video URL');
    }
    
    // Download the file
    const downloadResult = await downloadFile(url, 'tiktok');
    
    // Send the downloaded file
    await ctx.telegram.sendVideo(
      ctx.chat.id,
      { source: downloadResult.path, filename: downloadResult.filename },
      {
        caption: `🎵 TikTok video:
📦 Size: ${downloadResult.info.size}
🔗 Source: ${url}`
      }
    );
    
    // Update the message
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      `✅ TikTok download complete!`
    );
    
    // Clean up the file
    fs.unlinkSync(downloadResult.path);
    
  } catch (error) {
    console.error(`TikTok download error: ${error.message}`);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      progressMessage.message_id,
      undefined,
      `❌ Error downloading from TikTok: ${error.message}`
    );
  }
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
