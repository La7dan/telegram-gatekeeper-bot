
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Shield, Settings, Menu, Database, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const { user, logout, getDatabaseStatus } = useAuth();
  const navigate = useNavigate();
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: "Checking database status..."
  });
  
  useEffect(() => {
    const checkConnection = async () => {
      const status = await getDatabaseStatus();
      setDbStatus(status);
    };
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [getDatabaseStatus]);
  
  return (
    <nav className="bg-telegram-blue text-white shadow">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Telegram Gatekeeper</h1>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-telegram-dark-blue/30 rounded-full text-xs">
              <span className={`inline-block w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <Database size={12} />
              <span>{dbStatus.connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-telegram-dark-blue">
                    <span className="mr-2">{user.username}</span>
                    <div className="h-8 w-8 rounded-full bg-telegram-dark-blue flex items-center justify-center">
                      <User size={18} />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <div className="font-medium">@{user.username}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/')} className="flex items-center cursor-pointer">
                    <User size={16} className="mr-2" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/bot-manager')} className="flex items-center cursor-pointer">
                        <Bot size={16} className="mr-2" />
                        <span>Bot Manager</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center cursor-pointer">
                        <Shield size={16} className="mr-2" />
                        <span>Admin Settings</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem className="flex items-center cursor-pointer">
                    <Settings size={16} className="mr-2" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" className="text-white hover:bg-telegram-dark-blue" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button className="bg-white text-telegram-blue hover:bg-gray-100" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
