
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Check, Globe, Webhook } from 'lucide-react';

interface WebhookConfigProps {
  botId: string;
  initialWebhookUrl?: string;
  onSave: (botId: string, webhookUrl: string) => void;
}

const WebhookConfig: React.FC<WebhookConfigProps> = ({ botId, initialWebhookUrl = '', onSave }) => {
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleSave = () => {
    onSave(botId, webhookUrl);
    toast.success("Webhook URL saved successfully");
  };
  
  const handleTest = async () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL first");
      return;
    }
    
    setIsTesting(true);
    
    try {
      // In a real implementation, we'd make an actual request to the webhook
      // Here, we'll simulate a successful response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Webhook test successful!");
    } catch (error) {
      toast.error("Webhook test failed. Please check the URL and try again.");
    } finally {
      setIsTesting(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    toast.success("Copied to clipboard!");
  };
  
  // Generate a sample payload for demonstration
  const samplePayload = JSON.stringify({
    event: "message_received",
    chat_id: 12345678,
    message: {
      id: 98765,
      text: "Hello bot!",
      from: {
        id: 87654321,
        username: "user123",
        first_name: "John",
        last_name: "Doe"
      }
    },
    timestamp: new Date().toISOString()
  }, null, 2);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook size={20} />
          Webhook Configuration
        </CardTitle>
        <CardDescription>
          Set up the webhook URL where your Telegram bot will send updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="webhook" className="block text-sm font-medium mb-1">Webhook URL</label>
            <Input 
              id="webhook" 
              value={webhookUrl} 
              onChange={(e) => setWebhookUrl(e.target.value)} 
              placeholder="https://example.com/webhook/telegram"
              className="font-mono text-sm"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              This is where Telegram will send updates when your bot receives messages
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Sample Payload</p>
            <div className="relative">
              <Textarea 
                value={samplePayload} 
                readOnly 
                className="font-mono text-xs bg-muted h-32 resize-none"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2" 
                onClick={() => copyToClipboard(samplePayload)}
                title="Copy payload"
              >
                {copySuccess ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This shows the format of data your webhook will receive
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleTest}
          disabled={isTesting || !webhookUrl}
        >
          {isTesting ? <RefreshCw size={16} className="animate-spin" /> : <Globe size={16} />}
          <span>{isTesting ? 'Testing...' : 'Test Webhook'}</span>
        </Button>
        <Button onClick={handleSave} disabled={!webhookUrl}>
          Save Webhook
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebhookConfig;
