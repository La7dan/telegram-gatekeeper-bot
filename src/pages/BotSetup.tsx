
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot } from 'lucide-react';

const BotSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Bot Setup</CardTitle>
            <CardDescription>Configure your Telegram bot settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Getting Started with Telegram Bots</h3>
                <p className="text-muted-foreground mb-3">
                  Follow these steps to create and configure your Telegram bot:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Talk to <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">@BotFather</a> on Telegram</li>
                  <li>Create a new bot using the <code>/newbot</code> command</li>
                  <li>Choose a name and username for your bot</li>
                  <li>Copy the API token that BotFather gives you</li>
                  <li>Add your bot to the Bot Manager section</li>
                </ol>
              </div>
              
              {user?.role === 'admin' && (
                <div className="border rounded-lg p-5 bg-blue-50 border-blue-100">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Bot className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-blue-900 mb-1">Admin Bot Controls</h3>
                      <p className="text-sm text-blue-700 mb-4">
                        As an admin, you can add, manage and configure all the bots in the system.
                      </p>
                      <Button 
                        onClick={() => navigate('/bot-manager')}
                        className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
                      >
                        <span>Go to Bot Manager</span>
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/50 border-t">
            <p className="text-xs text-muted-foreground">
              Need help? Check out the <a href="https://core.telegram.org/bots/api" target="_blank" rel="noreferrer" className="underline">Telegram Bot API documentation</a>.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default BotSetup;
