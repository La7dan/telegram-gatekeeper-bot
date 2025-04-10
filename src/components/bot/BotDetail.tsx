
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Webhook, Command, BarChart3, Edit2 } from 'lucide-react';
import WebhookConfig from './WebhookConfig';
import CommandManager from './CommandManager';
import AnalyticsDashboard from './AnalyticsDashboard';

interface BotConfig {
  id: string;
  name: string;
  apiKey: string;
  description: string;
  status: 'active' | 'inactive';
  dateAdded: string;
  webhook?: string;
  commands?: Array<{
    id: string;
    command: string;
    description: string;
    response: string;
    isEnabled: boolean;
  }>;
}

interface BotDetailProps {
  bot: BotConfig;
  onBack: () => void;
  onUpdate: (updatedBot: BotConfig) => void;
}

const BotDetail: React.FC<BotDetailProps> = ({ bot, onBack, onUpdate }) => {
  const [activeBot, setActiveBot] = useState<BotConfig>(bot);

  const handleWebhookSave = (botId: string, webhookUrl: string) => {
    const updatedBot = { ...activeBot, webhook: webhookUrl };
    setActiveBot(updatedBot);
    onUpdate(updatedBot);
  };

  const handleCommandsSave = (botId: string, commands: any[]) => {
    const updatedBot = { ...activeBot, commands };
    setActiveBot(updatedBot);
    onUpdate(updatedBot);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bot size={24} />
              {activeBot.name}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                activeBot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {activeBot.status}
              </span>
            </h1>
            <p className="text-muted-foreground">{activeBot.description || "No description"}</p>
          </div>
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Edit2 size={16} />
          Edit Details
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Bot Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Key</p>
              <p className="font-mono bg-muted p-2 mt-1 rounded text-sm truncate">
                {activeBot.apiKey}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date Added</p>
              <p className="font-mono bg-muted p-2 mt-1 rounded text-sm">
                {new Date(activeBot.dateAdded).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="webhook">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="webhook" className="flex items-center gap-2">
            <Webhook size={16} />
            <span className="hidden md:inline">Webhook</span>
            <span className="md:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger value="commands" className="flex items-center gap-2">
            <Command size={16} />
            <span className="hidden md:inline">Commands</span>
            <span className="md:hidden">Cmds</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span className="hidden md:inline">Analytics</span>
            <span className="md:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="webhook" className="mt-6">
          <WebhookConfig 
            botId={activeBot.id} 
            initialWebhookUrl={activeBot.webhook}
            onSave={handleWebhookSave}
          />
        </TabsContent>
        
        <TabsContent value="commands" className="mt-6">
          <CommandManager 
            botId={activeBot.id} 
            initialCommands={activeBot.commands || []}
            onSave={handleCommandsSave}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard botId={activeBot.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotDetail;
