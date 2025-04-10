
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, RefreshCw, Trash2, Edit2, MessageSquare, Bot } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Define bot type
interface BotConfig {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  status: 'active' | 'inactive';
  dateAdded: string;
}

const BotManager: React.FC = () => {
  const { user, getDatabaseStatus } = useAuth();
  const navigate = useNavigate();
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: "Checking database status..."
  });
  
  // New bot form state
  const [newBot, setNewBot] = useState({
    name: '',
    apiKey: '',
    description: ''
  });
  
  // Adding bot state
  const [isAdding, setIsAdding] = useState(false);
  
  // Check database connection
  useEffect(() => {
    const checkDbStatus = async () => {
      const status = await getDatabaseStatus();
      setDbStatus(status);
    };
    checkDbStatus();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkDbStatus, 30000);
    return () => clearInterval(interval);
  }, [getDatabaseStatus]);
  
  // Load bots from local storage (simulating database)
  useEffect(() => {
    const storedBots = localStorage.getItem('telegram_bots');
    if (storedBots) {
      try {
        const parsedBots = JSON.parse(storedBots);
        // Ensure all bots have a valid status
        const validatedBots = parsedBots.map((bot: any) => ({
          ...bot,
          // Ensure status is either 'active' or 'inactive'
          status: bot.status === 'active' ? 'active' : 'inactive'
        }));
        setBots(validatedBots);
      } catch (error) {
        console.error("Error loading bots:", error);
        setBots([]);
      }
    }
  }, []);
  
  // Save bots to local storage
  const saveBots = (updatedBots: BotConfig[]) => {
    localStorage.setItem('telegram_bots', JSON.stringify(updatedBots));
    setBots(updatedBots);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBot(prev => ({ ...prev, [name]: value }));
  };
  
  // Add new bot
  const handleAddBot = () => {
    if (!newBot.name || !newBot.apiKey) {
      toast.error("Bot name and API key are required");
      return;
    }
    
    const now = new Date();
    const newBotConfig: BotConfig = {
      id: `bot-${Date.now()}`,
      name: newBot.name,
      apiKey: newBot.apiKey,
      description: newBot.description,
      status: 'active',
      dateAdded: now.toISOString()
    };
    
    const updatedBots = [...bots, newBotConfig];
    saveBots(updatedBots);
    
    // Reset form
    setNewBot({
      name: '',
      apiKey: '',
      description: ''
    });
    setIsAdding(false);
    toast.success("Bot added successfully");
  };
  
  // Delete bot
  const handleDeleteBot = (id: string) => {
    const updatedBots = bots.filter(bot => bot.id !== id);
    saveBots(updatedBots);
    toast.success("Bot removed successfully");
  };
  
  // Toggle bot status
  const toggleBotStatus = (id: string) => {
    const updatedBots = bots.map(bot => {
      if (bot.id === id) {
        // Explicitly set the status as either 'active' or 'inactive'
        const newStatus: 'active' | 'inactive' = bot.status === 'active' ? 'inactive' : 'active';
        return { ...bot, status: newStatus };
      }
      return bot;
    });
    saveBots(updatedBots);
    toast.success(`Bot ${updatedBots.find(b => b.id === id)?.status === 'active' ? 'activated' : 'deactivated'}`);
  };
  
  // If user is not an admin, redirect to home
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      toast.error("Admin access required");
    }
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== 'admin') {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Bot Manager</h1>
            <p className="text-muted-foreground">Add and manage Telegram bots</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs">
              <span className={`inline-block w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span>{dbStatus.connected ? 'DB Connected' : 'DB Disconnected'}</span>
            </div>
            
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
                <PlusCircle size={16} />
                <span>Add Bot</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Add Bot Form */}
        {isAdding && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot size={20} />
                Add New Bot
              </CardTitle>
              <CardDescription>
                Configure a new Telegram bot connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Bot Name</label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={newBot.name} 
                      onChange={handleInputChange} 
                      placeholder="My Telegram Bot"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium mb-1">API Key</label>
                    <Input 
                      id="apiKey" 
                      name="apiKey" 
                      value={newBot.apiKey} 
                      onChange={handleInputChange} 
                      placeholder="1234567890:ABCDEF-ghijklmnopqrstuvwxyz"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={newBot.description} 
                    onChange={handleInputChange} 
                    placeholder="Bot purpose and functionality"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBot}>
                Save Bot
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {/* Bots List */}
        <Card>
          <CardHeader>
            <CardTitle>Configured Bots</CardTitle>
            <CardDescription>
              List of all Telegram bots connected to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bots.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bot Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bots.map((bot) => (
                    <TableRow key={bot.id}>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-xs font-mono bg-muted p-1 rounded truncate max-w-[140px]">
                            {bot.apiKey.substring(0, 10)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {bot.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          bot.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bot.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(bot.dateAdded).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleBotStatus(bot.id)}
                            title={bot.status === 'active' ? "Deactivate" : "Activate"}
                          >
                            <RefreshCw size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteBot(bot.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bot size={40} className="mx-auto mb-2 opacity-50" />
                <p>No bots have been added yet.</p>
                {!isAdding && (
                  <Button onClick={() => setIsAdding(true)} variant="outline" className="mt-4">
                    Add Your First Bot
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BotManager;
