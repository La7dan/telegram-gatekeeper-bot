import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserIcon, ShieldIcon, ShieldOff } from "lucide-react";

const UserManagement: React.FC = () => {
  const { user, users, authorizeUser, deauthorizeUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'authorize' | 'deauthorize'>('authorize');
  
  const handleAuthorize = (userData: any) => {
    setSelectedUser(userData);
    setActionType('authorize');
    setShowConfirmDialog(true);
  };
  
  const handleDeauthorize = (userData: any) => {
    setSelectedUser(userData);
    setActionType('deauthorize');
    setShowConfirmDialog(true);
  };
  
  const confirmAction = () => {
    if (!selectedUser) return;
    
    try {
      if (actionType === 'authorize') {
        authorizeUser(selectedUser.id);
      } else {
        deauthorizeUser(selectedUser.id);
      }
      setShowConfirmDialog(false);
    } catch (error) {
      toast.error(`Failed to ${actionType} user`);
    }
  };
  
  const getUserWithActivity = (u: any) => {
    const now = Date.now();
    const randomTime = Math.floor(Math.random() * 86400000); // Random time within 24 hours
    return {
      ...u,
      lastActive: new Date(now - randomTime),
      commandsIssued: Math.floor(Math.random() * 50) // Random number of commands
    };
  };
  
  const isAdmin = user && user.role === 'admin';
  
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="bg-muted p-3 rounded-full">
                <ShieldOff className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-1">Admin Access Required</h3>
            <p className="text-muted-foreground">
              You need administrator privileges to access user management features.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <CardTitle>User Management</CardTitle>
        <div className="ml-auto flex items-center">
          <div className="bg-telegram-blue text-white text-xs px-2 py-1 rounded">
            Admin Panel
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const userWithActivity = getUserWithActivity(u);
              return (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="bg-muted rounded-full p-1">
                        <UserIcon size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <div>{u.username}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.role === 'admin' ? (
                      <Badge variant="outline" className="border-telegram-blue text-telegram-blue">
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {u.isAuthorized ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Authorized</Badge>
                    ) : (
                      <Badge variant="secondary">Unauthorized</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {userWithActivity.lastActive.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {userWithActivity.commandsIssued} commands
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {u.isAuthorized ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-500"
                        onClick={() => handleDeauthorize(u)}
                      >
                        Revoke Access
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-green-200 hover:border-green-300 hover:bg-green-50 text-green-600"
                        onClick={() => handleAuthorize(u)}
                      >
                        Grant Access
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'authorize' ? 'Grant Access' : 'Revoke Access'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'authorize' 
                  ? `This will give ${selectedUser?.username} access to all protected bot commands.`
                  : `This will revoke ${selectedUser?.username}'s access to protected bot commands.`
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className={`rounded-full p-2 ${
                actionType === 'authorize' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {actionType === 'authorize' ? <ShieldIcon size={20} /> : <ShieldOff size={20} />}
              </div>
              <div>
                <h4 className="font-medium">{selectedUser?.username}</h4>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmAction}
                className={actionType === 'authorize' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {actionType === 'authorize' ? 'Grant Access' : 'Revoke Access'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
