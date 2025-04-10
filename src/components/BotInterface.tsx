
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findCommand, CommandLog } from '@/utils/botCommands';
import { toast } from 'sonner';
import { SendIcon } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          } catch (error) {
            botResponse = "❌ Error executing command.";
          }
        }
      }

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
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
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`message-bubble ${
              message.sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot'
            }`}>
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-gray-600' : 'text-white/80'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
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
            disabled={!user}
          />
          <Button 
            type="submit" 
            className="bg-telegram-blue hover:bg-telegram-dark-blue text-white rounded-full w-10 h-10 p-0"
            disabled={!user || !input.trim()}
          >
            <SendIcon size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BotInterface;
