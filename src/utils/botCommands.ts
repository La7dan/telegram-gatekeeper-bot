
export interface BotCommand {
  command: string;
  description: string;
  requiresAuth: boolean;
  handler: (params?: string) => string;
}

export interface CommandLog {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  command: string;
  success: boolean;
  response: string;
}

// Social media platforms supported by the bot
export const supportedPlatforms = [
  { name: "YouTube", command: "youtube", icon: "🎥" },
  { name: "Instagram", command: "instagram", icon: "📸" },
  { name: "TikTok", command: "tiktok", icon: "🎵" },
  { name: "Snapchat", command: "snapchat", icon: "👻" },
];

// Bot commands definition
export const botCommands: BotCommand[] = [
  {
    command: "/start",
    description: "Start the bot",
    requiresAuth: false,
    handler: () => "👋 Welcome to the Gatekeeper Bot! Type /help to see available commands."
  },
  {
    command: "/help",
    description: "Show available commands",
    requiresAuth: false,
    handler: () => {
      return `📋 Available commands:
/start - Start the bot
/help - Show this help message
/status - Check your authorization status
/time - Show current server time
/weather - Check the weather (authorized users)
/stats - View bot statistics (authorized users)
/secure - Access secure data (authorized users)

📥 Download Commands:
/download [url] - Download from social media (YouTube, Instagram, TikTok, Snapchat)
/youtube [url] - Download from YouTube
/instagram [url] - Download from Instagram 
/tiktok [url] - Download from TikTok
/snapchat [url] - Download from Snapchat

🔊 Audio Commands:
/extract [url] - Extract audio from a video
/convert [url] [format] - Convert media to different format`
    }
  },
  {
    command: "/status",
    description: "Check authorization status",
    requiresAuth: false,
    handler: () => "🔄 Checking your authorization status..."
  },
  {
    command: "/time",
    description: "Show current server time",
    requiresAuth: false,
    handler: () => `🕒 Current server time: ${new Date().toLocaleTimeString()}`
  },
  {
    command: "/weather",
    description: "Get weather information",
    requiresAuth: true,
    handler: (params) => {
      const locations = ["New York", "London", "Tokyo", "Sydney", "Moscow"];
      const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Partly cloudy"];
      const temperatures = [12, 18, 25, 30, 5, -2, 8, 15, 22];
      
      const location = params || locations[Math.floor(Math.random() * locations.length)];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const temperature = temperatures[Math.floor(Math.random() * temperatures.length)];
      
      return `🌤 Weather for ${location}:
Condition: ${condition}
Temperature: ${temperature}°C
Humidity: ${Math.floor(Math.random() * 100)}%`;
    }
  },
  {
    command: "/stats",
    description: "View bot statistics",
    requiresAuth: true,
    handler: () => {
      const users = Math.floor(Math.random() * 1000) + 500;
      const commands = Math.floor(Math.random() * 10000) + 2000;
      const uptime = Math.floor(Math.random() * 720) + 24;
      
      return `📊 Bot Statistics:
Total users: ${users}
Commands processed: ${commands}
Uptime: ${uptime} hours
Server load: ${Math.floor(Math.random() * 80) + 10}%`;
    }
  },
  {
    command: "/secure",
    description: "Access secure data",
    requiresAuth: true,
    handler: () => {
      const secureData = [
        "Project Neptune launch codes: 45XFT-789-ALPHA",
        "Encrypted channel access: SECURED",
        "Database connection: ESTABLISHED",
        "Security clearance: LEVEL 4",
        "System integrity: 99.7%",
        "Protected resources: ACCESSIBLE"
      ].join("\n");
      
      return `🔐 SECURE DATA ACCESS GRANTED\n\n${secureData}`;
    }
  },
  {
    command: "/download",
    description: "Download content from social media",
    requiresAuth: true,
    handler: (params) => {
      if (!params || params.trim() === "") {
        return "⚠️ Please provide a valid URL. Usage: /download [url]";
      }
      
      const url = params.trim();
      let platform = "";
      
      // Detect platform from URL
      if (url.includes("youtube") || url.includes("youtu.be")) {
        platform = "YouTube";
      } else if (url.includes("instagram")) {
        platform = "Instagram";
      } else if (url.includes("tiktok")) {
        platform = "TikTok";
      } else if (url.includes("snapchat")) {
        platform = "Snapchat";
      } else {
        return "⚠️ Unsupported platform. Please provide a URL from YouTube, Instagram, TikTok, or Snapchat.";
      }
      
      // Mock download process
      const fileSize = Math.floor(Math.random() * 100) + 10;
      const fileType = Math.random() > 0.5 ? "video" : "image";
      const fileName = `${platform.toLowerCase()}_${Date.now()}.${fileType === "video" ? "mp4" : "jpg"}`;
      
      return `✅ Download from ${platform} completed successfully:
📄 File: ${fileName}
📦 Size: ${fileSize} MB
🔗 Source: ${url}

To save the file, click on the "Download" button that appears in the message.`;
    }
  },
  {
    command: "/youtube",
    description: "Download from YouTube",
    requiresAuth: true,
    handler: (params) => {
      if (!params || params.trim() === "") {
        return "⚠️ Please provide a valid YouTube URL. Usage: /youtube [url]";
      }
      
      const url = params.trim();
      if (!url.includes("youtube") && !url.includes("youtu.be")) {
        return "⚠️ Invalid YouTube URL. Please provide a valid YouTube link.";
      }
      
      // Mock YouTube download details
      const resolutions = ["480p", "720p", "1080p", "1440p", "4K"];
      const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
      const videoLength = Math.floor(Math.random() * 600) + 60; // 1-10 minutes in seconds
      const fileSize = Math.floor(Math.random() * 200) + 20;
      const videoId = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop();
      
      return `🎥 YouTube download completed:
🎬 Title: Amazing YouTube Video ${videoId}
⏱️ Length: ${Math.floor(videoLength / 60)}:${(videoLength % 60).toString().padStart(2, '0')}
📝 Quality: ${resolution}
📦 Size: ${fileSize} MB
🔗 Source: ${url}

To save the video, click on the "Download" button that appears in the message.`;
    }
  },
  {
    command: "/instagram",
    description: "Download from Instagram",
    requiresAuth: true,
    handler: (params) => {
      if (!params || params.trim() === "") {
        return "⚠️ Please provide a valid Instagram URL. Usage: /instagram [url]";
      }
      
      const url = params.trim();
      if (!url.includes("instagram")) {
        return "⚠️ Invalid Instagram URL. Please provide a valid Instagram link.";
      }
      
      // Determine if it's a post, reel, or story
      let contentType = "post";
      if (url.includes("/reel/")) {
        contentType = "reel";
      } else if (url.includes("/stories/")) {
        contentType = "story";
      }
      
      const username = `user_${Math.floor(Math.random() * 1000)}`;
      const fileSize = Math.floor(Math.random() * 50) + 5;
      
      return `📸 Instagram ${contentType} downloaded:
👤 User: @${username}
📦 Size: ${fileSize} MB
🔗 Source: ${url}

To save the content, click on the "Download" button that appears in the message.`;
    }
  },
  {
    command: "/tiktok",
    description: "Download from TikTok",
    requiresAuth: true,
    handler: (params) => {
      if (!params || params.trim() === "") {
        return "⚠️ Please provide a valid TikTok URL. Usage: /tiktok [url]";
      }
      
      const url = params.trim();
      if (!url.includes("tiktok")) {
        return "⚠️ Invalid TikTok URL. Please provide a valid TikTok link.";
      }
      
      const username = `tiktok_user_${Math.floor(Math.random() * 1000)}`;
      const videoLength = Math.floor(Math.random() * 60) + 10; // 10-70 seconds
      const views = Math.floor(Math.random() * 1000000) + 1000;
      const fileSize = Math.floor(Math.random() * 40) + 5;
      
      return `🎵 TikTok video downloaded:
👤 Creator: @${username}
⏱️ Duration: ${videoLength} seconds
👁️ Views: ${views.toLocaleString()}
📦 Size: ${fileSize} MB
🔗 Source: ${url}

To save the video, click on the "Download" button that appears in the message.`;
    }
  },
  {
    command: "/snapchat",
    description: "Download from Snapchat",
    requiresAuth: true,
    handler: (params) => {
      if (!params || params.trim() === "") {
        return "⚠️ Please provide a valid Snapchat URL. Usage: /snapchat [url]";
      }
      
      const url = params.trim();
      if (!url.includes("snapchat")) {
        return "⚠️ Invalid Snapchat URL. Please provide a valid Snapchat link.";
      }
      
      const username = `snap_user_${Math.floor(Math.random() * 1000)}`;
      const contentType = Math.random() > 0.5 ? "snap" : "story";
      const fileSize = Math.floor(Math.random() * 30) + 3;
      const expiresIn = Math.floor(Math.random() * 24); // Hours
      
      return `👻 Snapchat ${contentType} downloaded:
👤 User: @${username}
⏱️ Expires in: ${expiresIn} hours
📦 Size: ${fileSize} MB
🔗 Source: ${url}

To save the content, click on the "Download" button that appears in the message.`;
    }
  },
  {
    command: "/extract",
    description: "Extract audio from a video",
    requiresAuth: true,
    handler: (params) => {
      if (!params || params.trim() === "") {
        return "⚠️ Please provide a valid video URL. Usage: /extract [video_url]";
      }
      
      const url = params.trim();
      
      // Mock audio extraction process
      const formats = ["mp3", "wav", "aac", "ogg"];
      const format = formats[Math.floor(Math.random() * formats.length)];
      const bitrate = [128, 192, 256, 320][Math.floor(Math.random() * 4)];
      const duration = Math.floor(Math.random() * 600) + 60; // 1-10 minutes in seconds
      const fileSize = Math.floor(Math.random() * 15) + 2;
      
      return `🔊 Audio extracted successfully:
🎵 Format: ${format}
🎚️ Bitrate: ${bitrate} kbps
⏱️ Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}
📦 Size: ${fileSize} MB
🔗 Source: ${url}

To save the audio file, click on the "Download" button that appears in the message.`;
    }
  },
  {
    command: "/convert",
    description: "Convert media to different format",
    requiresAuth: true,
    handler: (params) => {
      if (!params || params.trim() === "") {
        return "⚠️ Please provide a URL and target format. Usage: /convert [url] [format]";
      }
      
      const parts = params.trim().split(' ');
      const url = parts[0];
      const targetFormat = parts.length > 1 ? parts[1].toLowerCase() : "mp3";
      
      const supportedFormats = ["mp3", "wav", "mp4", "avi", "gif", "jpg", "png"];
      
      if (!supportedFormats.includes(targetFormat)) {
        return `⚠️ Unsupported format: ${targetFormat}. Supported formats: ${supportedFormats.join(", ")}`;
      }
      
      // Determine if it's audio, video, or image format
      let mediaType = "audio";
      if (["mp4", "avi", "gif"].includes(targetFormat)) {
        mediaType = "video";
      } else if (["jpg", "png"].includes(targetFormat)) {
        mediaType = "image";
      }
      
      const fileSize = Math.floor(Math.random() * 20) + 2;
      
      return `✅ Media converted successfully to ${targetFormat.toUpperCase()}:
📄 Type: ${mediaType}
📦 Size: ${fileSize} MB
🔄 Source format: ${["mp4", "mp3", "jpg"][Math.floor(Math.random() * 3)]}
🎯 Target format: ${targetFormat}
🔗 Original source: ${url}

To save the converted file, click on the "Download" button that appears in the message.`;
    }
  }
];

// Command history (initial mock data)
export const initialCommandLogs: CommandLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 3600000),
    userId: "1",
    username: "admin",
    command: "/start",
    success: true,
    response: "👋 Welcome to the Gatekeeper Bot!"
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 2400000),
    userId: "2",
    username: "user1",
    command: "/weather Moscow",
    success: true,
    response: "🌤 Weather for Moscow: Cloudy, 5°C"
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1200000),
    userId: "3",
    username: "user2",
    command: "/secure",
    success: false,
    response: "⛔ Access denied. You are not authorized."
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 800000),
    userId: "1",
    username: "admin",
    command: "/youtube https://youtube.com/watch?v=dQw4w9WgXcQ",
    success: true,
    response: "🎥 YouTube download completed: Amazing YouTube Video dQw4w9WgXcQ (1080p)"
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 500000),
    userId: "1",
    username: "admin",
    command: "/extract https://youtube.com/watch?v=dQw4w9WgXcQ",
    success: true,
    response: "🔊 Audio extracted successfully: mp3, 320 kbps"
  }
];

export const findCommand = (input: string): { command: BotCommand, params?: string } | null => {
  const parts = input.trim().split(' ');
  const commandText = parts[0].toLowerCase();
  const params = parts.slice(1).join(' ');
  
  const command = botCommands.find(cmd => cmd.command === commandText);
  
  if (!command) return null;
  return { command, params };
};

// Utility to generate a mock download progress
export const generateDownloadProgress = (platform: string, currentProgress: number): string => {
  const icon = supportedPlatforms.find(p => p.command === platform.toLowerCase())?.icon || "📥";
  const progressBar = Array(10).fill('▱').map((char, i) => i < Math.floor(currentProgress / 10) ? '▰' : char).join('');
  
  return `${icon} Downloading from ${platform}: ${progressBar} ${currentProgress}%`;
};

