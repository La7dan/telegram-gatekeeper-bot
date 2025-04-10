import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ADMIN_USERNAME, SETUP_INSTRUCTIONS, BOT_TOKEN } from '@/utils/telegramConfig';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "@/components/ui/code";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Terminal, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { toast } from "sonner";

const BotSetup: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState<string | null>(null);
  const isAdmin = user?.username === ADMIN_USERNAME;

  console.log("BotSetup rendered with token:", BOT_TOKEN);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const setupCode = `
// Install required packages
npm install telegraf dotenv

// Create a bot.js file
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Basic commands
bot.start((ctx) => ctx.reply('Welcome to Qatar009 Bot'));
bot.help((ctx) => ctx.reply('Send me a message'));
bot.command('time', (ctx) => ctx.reply(\`Server time: \${new Date().toLocaleString()}\`));

// Download command handler for social media
bot.command('download', async (ctx) => {
  const url = ctx.message.text.split(' ')[1];
  if (!url) {
    return ctx.reply('Please provide a URL to download');
  }
  
  // Here would be the actual download logic
  ctx.reply(\`Processing download from: \${url}\`);
});

// Media platform specific commands
bot.command('youtube', (ctx) => {
  const url = ctx.message.text.split(' ')[1];
  if (!url) return ctx.reply('Please provide a YouTube URL');
  ctx.reply(\`Processing YouTube download: \${url}\`);
});

bot.command('instagram', (ctx) => {
  const url = ctx.message.text.split(' ')[1];
  if (!url) return ctx.reply('Please provide an Instagram URL');
  ctx.reply(\`Processing Instagram download: \${url}\`);
});

// Audio extraction
bot.command('extract', (ctx) => {
  const url = ctx.message.text.split(' ')[1];
  if (!url) return ctx.reply('Please provide a URL to extract audio from');
  ctx.reply(\`Extracting audio from: \${url}\`);
});

// Launch the bot
bot.launch();
console.log('Bot is running');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
`;

  const envExample = `
# Telegram Bot Configuration
BOT_TOKEN=1234567890:AAAABBBBCCCCDDDDEEEEFFFFGGGHHHIJJJ
ADMIN_USERNAME=qatar009

# Optional: For storing download files
DOWNLOADS_FOLDER=./downloads
`;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Telegram Bot Setup Guide</h1>
      
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertTitle>Component Updated</AlertTitle>
        <AlertDescription>
          This component has been updated. Current bot token: {BOT_TOKEN.substring(0, 10)}...
        </AlertDescription>
      </Alert>
      
      {isAdmin ? (
        <Badge className="mb-4 bg-green-600 hover:bg-green-700">Administrator Access</Badge>
      ) : (
        <Badge variant="outline" className="mb-4">Standard User</Badge>
      )}

      <Alert className="mb-6">
        <Info className="h-5 w-5" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          This is a guide for setting up the actual Telegram bot on a server. You'll need to deploy 
          this code on a server with internet access to make the bot available on Telegram.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="setup" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="setup" className="flex items-center">
            <Terminal size={16} className="mr-2" />
            <span>Setup Guide</span>
          </TabsTrigger>
          <TabsTrigger value="code">Code Example</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Your Telegram Bot</CardTitle>
              <CardDescription>
                Follow these steps to get your Telegram bot up and running
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 1: Create a Bot with BotFather</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Open Telegram and search for <strong>@BotFather</strong></li>
                  <li>Send the command <code>/newbot</code></li>
                  <li>Follow the prompts to choose a name and username for your bot</li>
                  <li>Once created, BotFather will give you a token - <strong>save this token</strong></li>
                  <li>You can set a description with <code>/setdescription</code> and an avatar with <code>/setuserpic</code></li>
                </ol>

                <div className="flex justify-end mt-2">
                  <Button variant="outline" onClick={() => window.open('https://t.me/botfather', '_blank')}>
                    Open BotFather <ExternalLink size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 2: Set Up Your Environment</h3>
                <p>Create a <code>.env</code> file in your project root with your bot token:</p>
                
                <div className="relative bg-muted rounded-md p-4">
                  <pre className="text-sm whitespace-pre-wrap">{envExample}</pre>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(envExample, '.env file')}
                  >
                    {copied === '.env file' ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 3: Install Required Packages</h3>
                <p>Run the following command to install the required packages:</p>
                
                <div className="bg-black text-white rounded-md p-3">
                  <code>npm install telegraf dotenv</code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-2 text-white hover:bg-gray-800"
                    onClick={() => handleCopy('npm install telegraf dotenv', 'install command')}
                  >
                    {copied === 'install command' ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 4: Create a Bot Script</h3>
                <p>Create a <code>bot.js</code> file and copy the example code from the "Code Example" tab</p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 5: Run Your Bot</h3>
                <p>Start your bot with:</p>
                
                <div className="bg-black text-white rounded-md p-3">
                  <code>node bot.js</code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-2 text-white hover:bg-gray-800"
                    onClick={() => handleCopy('node bot.js', 'run command')}
                  >
                    {copied === 'run command' ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
                
                <Alert>
                  <Info className="h-5 w-5" />
                  <AlertTitle>Keeping your bot running</AlertTitle>
                  <AlertDescription>
                    For production, use a process manager like PM2 to keep your bot running:
                    <div className="bg-black text-white rounded-md p-2 mt-2">
                      <code>npm install -g pm2</code><br/>
                      <code>pm2 start bot.js --name telegram-bot</code>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Your bot will be accessible at <code>t.me/your_bot_username</code> once it's running
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Bot Code Example</CardTitle>
              <CardDescription>
                Copy this basic bot implementation to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted rounded-md p-4">
                <pre className="text-sm overflow-auto">{setupCode}</pre>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(setupCode, 'bot code')}
                >
                  {copied === 'bot code' ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
              
              <div className="bg-muted p-4 rounded-md mt-6">
                <h4 className="font-medium mb-2">Adding Authentication</h4>
                <p className="text-sm mb-4">
                  To restrict commands to authorized users only, add this middleware to your bot:
                </p>
                <pre className="text-sm bg-black text-white p-3 rounded-md">
{`// User authentication middleware
const authorizedUsers = ['qatar009', 'user1']; // List of authorized usernames

const requireAuth = (ctx, next) => {
  const username = ctx.from.username;
  if (authorizedUsers.includes(username)) {
    return next();
  }
  return ctx.reply('You are not authorized to use this command.');
};

// Apply middleware to protected commands
bot.command('secure', requireAuth, (ctx) => {
  ctx.reply('This is a secure command only for authorized users');
});

bot.command('youtube', requireAuth, (ctx) => {
  // Your YouTube download logic
});`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>System Requirements & Recommendations</CardTitle>
              <CardDescription>
                What you need to run a Telegram bot successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Server Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Node.js 14+ installed</li>
                  <li>Stable internet connection</li>
                  <li>At least 512MB RAM (1GB+ recommended for media processing)</li>
                  <li>Storage space for downloaded media (depends on usage)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Deployment Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">VPS Hosting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Digital Ocean, AWS, Google Cloud</li>
                        <li>Full control over environment</li>
                        <li>Better for high-traffic bots</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Free/Budget Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Heroku (limited free tier)</li>
                        <li>Render.com</li>
                        <li>Railway.app</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Important Notes</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Keep your bot token secret and never commit it to public repositories</li>
                    <li>Respect Telegram's rate limits to avoid your bot being blocked</li>
                    <li>
                      For media downloads from platforms like YouTube, TikTok, etc., you'll need 
                      additional libraries like <code>youtube-dl</code> or platform-specific APIs
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {isAdmin && (
        <Card className="border-green-200 bg-green-50 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-800">Administrator Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              As <strong>qatar009</strong>, you have administrator privileges. When deployed, 
              you'll have access to all protected commands and admin features.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BotSetup;
