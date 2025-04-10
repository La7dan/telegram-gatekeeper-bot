
import React from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const BotSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is not logged in, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1 container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Bot Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Configure your Telegram bot here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BotSetup;
