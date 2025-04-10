
import React from 'react';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto py-2">
          <Button 
            variant="outline" 
            className="ml-auto flex items-center border-telegram-blue text-telegram-blue mb-2"
            onClick={() => navigate('/setup')}
          >
            <Rocket size={16} className="mr-2" /> 
            Launch Bot on Telegram
          </Button>
        </div>
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
