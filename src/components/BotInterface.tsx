
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findCommand, CommandLog, generateDownloadProgress } from '@/utils/botCommands';
import { toast } from 'sonner';
import { SendIcon, Download } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isDownloadable?: boolean;
  downloadUrl?: string;
  downloadName?: string;
  isInProgress?: boolean;
  progressValue?: number;
}

interface BotInterfaceProps {
  onAddLog: (log: CommandLog) => void;
}

const BotInterface: React.FC<BotInterfaceProps> = ({ onAddLog }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      sender: 'bot',
      text: 'Welcome to Telegram Gatekeeper Bot! Type /help to see available commands.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle download simulation
  const handleDownload = (messageId: string, platform: string) => {
    // Find the message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // Update message to show progress
    setIsDownloading(true);
    
    // Update the message to show it's downloading
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        isInProgress: true,
        progressValue: 0
      };
      return updatedMessages;
    });

    // Simulate download progress
    let progress = 0;
    const downloadInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      
      if (progress >= 100) {
        clearInterval(downloadInterval);
        progress = 100;
        
        // Complete the download
        setTimeout(() => {
          setMessages(prevMessages => {
            const finalMessages = [...prevMessages];
            finalMessages[messageIndex] = {
              ...finalMessages[messageIndex],
              isInProgress: false,
              text: finalMessages[messageIndex].text.split('\n\nTo save')[0] + '\n\n✅ Download completed!'
            };
            return finalMessages;
          });
          
          setIsDownloading(false);
          toast.success(`Download from ${platform} completed successfully!`);
        }, 500);
      }
      
      // Update progress
      setMessages(prevMessages => {
        const progressMessages = [...prevMessages];
        progressMessages[messageIndex] = {
          ...progressMessages[messageIndex],
          progressValue: progress,
          text: generateDownloadProgress(platform, progress)
        };
        return progressMessages;
      });
    }, 300);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    
    // Process command
    setIsTyping(true);
    setTimeout(() => {
      const result = findCommand(input);
      
      let botResponse: string;
      let success = false;
      let isDownloadable = false;
      let platform = "";
      
      if (!result) {
        botResponse = "⚠️ Unknown command. Type /help to see available commands.";
      } else {
        const { command, params } = result;
        
        // Check if command requires authorization
        if (command.requiresAuth && (!user || !user.isAuthorized)) {
          botResponse = "⛔ Access denied. You are not authorized for this command.";
        } else {
          // Execute the command
          try {
            botResponse = command.handler(params);
            success = true;
            
            // Check if this is a download command
            if (["/download", "/youtube", "/instagram", "/tiktok", "/snapchat", "/extract", "/convert"].includes(command.command)) {
              isDownloadable = true;
              
              // Determine platform for download handling
              if (command.command === "/youtube") platform = "YouTube";
              else if (command.command === "/instagram") platform = "Instagram";
              else if (command.command === "/tiktok") platform = "TikTok";
              else if (command.command === "/snapchat") platform = "Snapchat";
              else if (command.command === "/extract") platform = "Audio";
              else if (command.command === "/convert") platform = "Media";
              else if (command.command === "/download") {
                // Try to extract platform from URL
                const url = params?.toLowerCase() || "";
                if (url.includes("youtube")) platform = "YouTube";
                else if (url.includes("instagram")) platform = "Instagram";
                else if (url.includes("tiktok")) platform = "TikTok";
                else if (url.includes("snapchat")) platform = "Snapchat";
                else platform = "Media";
              }
            }
          } catch (error) {
            botResponse = "❌ Error executing command.";
          }
        }
      }

      // Add bot message
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMessageId,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
        isDownloadable,
        downloadName: isDownloadable ? `${platform.toLowerCase()}_${Date.now()}` : undefined,
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
      
      // Add to command log
      if (user) {
        const commandLog: CommandLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          userId: user.id,
          username: user.username,
          command: input,
          success,
          response: botResponse
        };
        
        onAddLog(commandLog);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-telegram-blue py-3 px-4">
        <h2 className="text-white font-semibold">Telegram Gatekeeper Bot</h2>
        <div className="text-white/80 text-sm flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2"></span>
          {user ? `@${user.username} (${user.isAuthorized ? 'Authorized' : 'Unauthorized'})` : 'Guest'}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div className={`message-bubble ${
              message.sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot'
            } max-w-[80%]`}>
              {message.isInProgress ? (
                <div className="w-full">
                  <div className="mb-2">{message.text}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-blue-400 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${message.progressValue}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right">{message.progressValue}%</div>
                </div>
              ) : (
                <>
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  
                  {message.isDownloadable && !message.isInProgress && (
                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white text-telegram-blue border-telegram-blue hover:bg-telegram-blue hover:text-white transition-colors"
                        onClick={() => handleDownload(message.id, message.downloadName?.split('_')[0] || 'media')}
                        disabled={isDownloading}
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                  
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-gray-600' : 'text-white/80'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="message-bubble message-bubble-bot animate-pulse-light">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={user ? "Type a command..." : "Please log in to use the bot"}
            className="telegram-input flex-grow"
            disabled={!user || isDownloading}
          />
          <Button 
            type="submit" 
            className="bg-telegram-blue hover:bg-telegram-dark-blue text-white rounded-full w-10 h-10 p-0"
            disabled={!user || !input.trim() || isDownloading}
          >
            <SendIcon size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BotInterface;
