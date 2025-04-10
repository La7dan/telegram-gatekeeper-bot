
import React, { useEffect, useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { isAuthenticated, login, getDatabaseStatus } = useAuth();
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: "Checking database status..."
  });

  // Check database connection status on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const status = await getDatabaseStatus();
      setDbStatus(status);
    };
    checkConnection();
  }, [getDatabaseStatus]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (formData: Record<string, string>) => {
    await login(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-telegram-blue text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Telegram Gatekeeper Bot</h1>
            <p className="text-white/80">Secure access control for your Telegram bot</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${dbStatus.connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className="text-xs">{dbStatus.connected ? 'DB Connected' : 'DB Disconnected'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <AuthForm type="login" onSubmit={handleSubmit} />
        </div>
      </div>
      
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Telegram Gatekeeper Bot · Secure Access Control · © 2025
        </div>
      </footer>
    </div>
  );
};

export default Login;
