
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (formData: Record<string, string>) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'register' && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {type === 'login' ? 'Login to Telegram Bot' : 'Register for Telegram Bot'}
        </CardTitle>
        <CardDescription className="text-center">
          {type === 'login' 
            ? 'Enter your credentials to access the bot' 
            : 'Create an account to request bot access'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                name="username"
                placeholder="your_username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="telegram-button w-full"
            disabled={loading}
          >
            {loading 
              ? 'Processing...' 
              : type === 'login' ? 'Login' : 'Register'}
          </Button>
          
          <div className="text-sm text-center text-muted-foreground mt-2">
            {type === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <a 
              href={type === 'login' ? '/register' : '/login'} 
              className="text-telegram-blue hover:underline"
            >
              {type === 'login' ? 'Register' : 'Login'}
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
