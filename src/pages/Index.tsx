
import React from 'react';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Rocket, ExternalLink } from 'lucide-react';
import { getBotInviteLink } from '@/utils/telegramConfig';

const Index = () => {
  const navigate = useNavigate();

  const handleOpenBot = () => {
    // Open the bot in a new tab
    window.open(getBotInviteLink(), '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto py-2 flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            className="flex items-center border-telegram-blue text-telegram-blue mb-2"
            onClick={() => navigate('/setup')}
          >
            <Rocket size={16} className="mr-2" /> 
            Setup Bot
          </Button>
          
          <Button 
            className="flex items-center bg-telegram-blue hover:bg-telegram-dark-blue text-white mb-2"
            onClick={handleOpenBot}
          >
            <ExternalLink size={16} className="mr-2" /> 
            Open Bot on Telegram
          </Button>
        </div>
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
