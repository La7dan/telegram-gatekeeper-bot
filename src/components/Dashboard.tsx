
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import BotInterface from './BotInterface';
import CommandHistory from './CommandHistory';
import UserManagement from './UserManagement';
import { CommandLog, initialCommandLogs, supportedPlatforms } from '@/utils/botCommands';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockIcon, MessageSquare, Activity, Users, Download, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>(initialCommandLogs);

  // Handler to add new logs
  const handleAddLog = (log: CommandLog) => {
    setCommandLogs(prev => [log, ...prev]);
  };
  
  // If not authenticated, show access denied
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-red-100">
                <LockIcon className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-center">Access Restricted</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to access the Telegram bot dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please log in or register to use the Telegram Gatekeeper Bot.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outline" onClick={() => navigate('/register')}>
              Register
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Show unauthorized message if user is not authorized
  if (user && !user.isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-amber-100">
                <LockIcon className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-center">Pending Authorization</CardTitle>
            <CardDescription className="text-center">
              Your account is waiting for administrator approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg text-center mb-4">
              <p>
                Hello <span className="font-medium">@{user.username}</span>, your account 
                registration has been submitted successfully. An administrator needs to 
                authorize your account before you can use the protected bot commands.
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              You can test non-restricted commands like <code>/start</code>, <code>/help</code>, 
              and <code>/time</code> while waiting for authorization.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" className="mr-2" onClick={() => navigate('/')}>
              Try Basic Commands
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="chat" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center">
              <MessageSquare size={16} className="mr-2" />
              <span>Bot Chat</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <Activity size={16} className="mr-2" />
              <span>Command History</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users size={16} className="mr-2" />
              <span>User Management</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
            <span className={`inline-block w-2 h-2 rounded-full ${user?.isAuthorized ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></span>
            <span>{user?.isAuthorized ? 'Authorized' : 'Unauthorized'}</span>
          </div>
        </div>
        
        <TabsContent value="chat" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BotInterface onAddLog={handleAddLog} />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Information</CardTitle>
                  <CardDescription>
                    Information about the Gatekeeper Bot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Online</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Bot Version</h4>
                    <p>v1.1.0</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                    <p>April 10, 2025</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Available Commands</h4>
                    <ul className="bg-muted p-3 rounded-md text-sm">
                      <li><code>/start</code> - Start the bot</li>
                      <li><code>/help</code> - Show available commands</li>
                      <li><code>/status</code> - Check authorization status</li>
                      <li><code>/time</code> - Show current server time</li>
                      <li className="text-muted-foreground"><code>/weather</code> - Get weather (authorized)</li>
                      <li className="text-muted-foreground"><code>/stats</code> - View stats (authorized)</li>
                      <li className="text-muted-foreground"><code>/secure</code> - Access secure data (authorized)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Download size={18} className="mr-2" />
                      Download Features
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">New</Badge>
                  </div>
                  <CardDescription>
                    Download media from popular platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Supported Platforms</h4>
                      <div className="flex flex-wrap gap-2">
                        {supportedPlatforms.map((platform) => (
                          <div key={platform.name} className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                            <span className="mr-1">{platform.icon}</span>
                            {platform.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Download Commands</h4>
                      <ul className="bg-muted p-3 rounded-md text-xs space-y-1">
                        <li><code>/download [url]</code> - Download from any platform</li>
                        <li><code>/youtube [url]</code> - Download from YouTube</li>
                        <li><code>/instagram [url]</code> - Download from Instagram</li>
                        <li><code>/tiktok [url]</code> - Download from TikTok</li>
                        <li><code>/snapchat [url]</code> - Download from Snapchat</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Audio Features</h4>
                      <div className="flex items-center mb-2">
                        <Music size={14} className="mr-1.5 text-blue-500" />
                        <span className="text-sm">Audio Extraction</span>
                      </div>
                      <ul className="bg-muted p-3 rounded-md text-xs space-y-1">
                        <li><code>/extract [url]</code> - Extract audio from video</li>
                        <li><code>/convert [url] [format]</code> - Convert media format</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <CommandHistory logs={commandLogs} />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
