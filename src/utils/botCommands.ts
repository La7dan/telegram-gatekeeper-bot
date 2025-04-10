
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
/secure - Access secure data (authorized users)`
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
