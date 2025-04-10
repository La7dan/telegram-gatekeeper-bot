
import React, { createContext, useState, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  isAuthorized: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  authorizeUser: (userId: string) => void;
  deauthorizeUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    isAuthorized: true
  },
  {
    id: "2",
    username: "user1",
    email: "user1@example.com",
    role: "user",
    isAuthorized: true
  },
  {
    id: "3",
    username: "user2",
    email: "user2@example.com",
    role: "user",
    isAuthorized: false
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email === email);
        
        if (foundUser && password === "password") { // Simple mock password
          setUser(foundUser);
          localStorage.setItem("user", JSON.stringify(foundUser));
          toast.success("Login successful!");
          navigate("/");
          resolve();
        } else {
          toast.error("Invalid email or password");
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users.some(u => u.email === email)) {
          toast.error("User with this email already exists");
          reject(new Error("Email already exists"));
          return;
        }

        const newUser: User = {
          id: `${users.length + 1}`,
          username,
          email,
          role: "user",
          isAuthorized: false
        };

        setUsers(prevUsers => [...prevUsers, newUser]);
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success("Registration successful! Waiting for authorization.");
        navigate("/");
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const authorizeUser = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, isAuthorized: true } : u
      )
    );
    
    // If the current user is being authorized, update their state
    if (user && user.id === userId) {
      const updatedUser = { ...user, isAuthorized: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    toast.success("User authorized successfully");
  };

  const deauthorizeUser = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, isAuthorized: false } : u
      )
    );
    
    // If the current user is being deauthorized, update their state
    if (user && user.id === userId) {
      const updatedUser = { ...user, isAuthorized: false };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    toast.success("User deauthorized successfully");
  };

  // Check for stored user on component mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        // Verify user still exists in our system and update with latest authorization status
        const currentUserData = users.find(u => u.id === parsedUser.id);
        if (currentUserData) {
          setUser(currentUserData);
        } else {
          localStorage.removeItem("user");
        }
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      authorizeUser, 
      deauthorizeUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
