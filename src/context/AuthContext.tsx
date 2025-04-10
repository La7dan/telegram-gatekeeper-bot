import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ADMIN_USERNAME } from "@/utils/telegramConfig";

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
  users: User[];
  getDatabaseStatus: () => Promise<{ connected: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial admin user to create if no users exist
const INITIAL_ADMIN: User = {
  id: "1",
  username: "La7dan",
  email: "La7dan@gmail.com",
  role: "admin",
  isAuthorized: true
};

// Mock database connection info (would be stored securely in a real app)
const DB_CONFIG = {
  name: "telbot",
  user: "telbot",
  password: "Ala@450"
};

// This function simulates connecting to PostgreSQL and initializing the database
const initializeDatabase = async (): Promise<User[]> => {
  console.log("Attempting to connect to database:", DB_CONFIG.name);
  
  // In a real app, this would connect to Postgres via Supabase or another service
  // Here we simulate the database by using localStorage
  let storedUsers = localStorage.getItem("telegram_bot_users");
  let users: User[] = [];
  
  if (storedUsers) {
    try {
      users = JSON.parse(storedUsers);
      console.log("Found existing users in database:", users.length);
    } catch (error) {
      console.error("Error parsing stored users:", error);
      users = [];
    }
  }
  
  // If no users exist, create the initial admin with La7dan@gmail.com
  if (users.length === 0) {
    console.log("No users found, creating initial admin user:", INITIAL_ADMIN.username);
    users = [INITIAL_ADMIN];
    localStorage.setItem("telegram_bot_users", JSON.stringify(users));
  }
  
  return users;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const navigate = useNavigate();

  // Initialize database connection and load users
  useEffect(() => {
    const loadDatabase = async () => {
      setIsLoading(true);
      try {
        const loadedUsers = await initializeDatabase();
        setUsers(loadedUsers);
        setDbConnected(true);
        
        // Check for stored session
        const storedUser = localStorage.getItem("current_user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as User;
            // Verify user still exists in our system
            const currentUserData = loadedUsers.find(u => u.id === parsedUser.id);
            if (currentUserData) {
              setUser(currentUserData);
            } else {
              localStorage.removeItem("current_user");
            }
          } catch (error) {
            localStorage.removeItem("current_user");
          }
        }
      } catch (error) {
        console.error("Database initialization failed:", error);
        setDbConnected(false);
        toast.error("Failed to connect to database");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDatabase();
  }, []);

  const isAuthenticated = !!user;

  const saveUsersToDatabase = (updatedUsers: User[]) => {
    // In a real app, this would save to PostgreSQL
    // For now, we use localStorage as our "database"
    localStorage.setItem("telegram_bot_users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // In a real app, we would verify against the PostgreSQL database
          // Here we check against our stored users array
          const foundUser = users.find(u => u.email === email);
          
          // Check for the specific admin user
          if (email === "La7dan@gmail.com" && password === "Ala@450") {
            const adminUser = users.find(u => u.email === "La7dan@gmail.com") || INITIAL_ADMIN;
            setUser(adminUser);
            localStorage.setItem("current_user", JSON.stringify(adminUser));
            toast.success("Admin login successful!");
            navigate("/");
            resolve();
            return;
          }
          
          // For other users
          if (foundUser && password === "password") {
            setUser(foundUser);
            localStorage.setItem("current_user", JSON.stringify(foundUser));
            toast.success("Login successful!");
            navigate("/");
            resolve();
          } else {
            toast.error("Invalid email or password");
            reject(new Error("Invalid credentials"));
          }
        } catch (error) {
          toast.error("Login failed");
          reject(error);
        }
      }, 500);
    });
  };

  // Get database connection status
  const getDatabaseStatus = useCallback(async (): Promise<{ connected: boolean; message: string }> => {
    return {
      connected: dbConnected,
      message: dbConnected 
        ? `Connected to ${DB_CONFIG.name} as ${DB_CONFIG.user}`
        : "Database connection failed"
    };
  }, [dbConnected]);

  const register = async (username: string, email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
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

          const updatedUsers = [...users, newUser];
          saveUsersToDatabase(updatedUsers);
          
          setUser(newUser);
          localStorage.setItem("current_user", JSON.stringify(newUser));
          toast.success("Registration successful! Waiting for authorization.");
          navigate("/");
          resolve();
        } catch (error) {
          toast.error("Registration failed");
          reject(error);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const authorizeUser = (userId: string) => {
    try {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, isAuthorized: true } : u
      );
      
      saveUsersToDatabase(updatedUsers);
      
      // If the current user is being authorized, update their state
      if (user && user.id === userId) {
        const updatedUser = { ...user, isAuthorized: true };
        setUser(updatedUser);
        localStorage.setItem("current_user", JSON.stringify(updatedUser));
      }
      
      toast.success("User authorized successfully");
    } catch (error) {
      toast.error("Failed to authorize user");
      console.error(error);
    }
  };

  const deauthorizeUser = (userId: string) => {
    try {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, isAuthorized: false } : u
      );
      
      saveUsersToDatabase(updatedUsers);
      
      // If the current user is being deauthorized, update their state
      if (user && user.id === userId) {
        const updatedUser = { ...user, isAuthorized: false };
        setUser(updatedUser);
        localStorage.setItem("current_user", JSON.stringify(updatedUser));
      }
      
      toast.success("User deauthorized successfully");
    } catch (error) {
      toast.error("Failed to deauthorize user");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telegram-blue mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      authorizeUser, 
      deauthorizeUser,
      users,
      getDatabaseStatus
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
