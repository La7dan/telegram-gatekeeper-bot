
import React from 'react';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Register: React.FC = () => {
  const { isAuthenticated, register } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (formData: Record<string, string>) => {
    await register(formData.username, formData.email, formData.password);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-telegram-blue text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Telegram Gatekeeper Bot</h1>
          <p className="text-white/80">Secure access control for your Telegram bot</p>
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <AuthForm type="register" onSubmit={handleSubmit} />
          
          <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Registration Info</h3>
            <p className="text-xs text-blue-700">
              Newly registered accounts require administrator approval before 
              accessing restricted bot features. You'll be able to use basic commands immediately.
            </p>
          </div>
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

export default Register;
