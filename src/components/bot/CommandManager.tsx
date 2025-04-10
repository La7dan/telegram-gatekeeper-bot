
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Command, Trash2, Save, Plus, MessageSquare, Code } from 'lucide-react';
import { toast } from 'sonner';

interface BotCommand {
  id: string;
  command: string;
  description: string;
  response: string;
  isEnabled: boolean;
}

interface CommandManagerProps {
  botId: string;
  initialCommands?: BotCommand[];
  onSave: (botId: string, commands: BotCommand[]) => void;
}

const CommandManager: React.FC<CommandManagerProps> = ({ botId, initialCommands = [], onSave }) => {
  const [commands, setCommands] = useState<BotCommand[]>(initialCommands);
  const [newCommand, setNewCommand] = useState({
    command: '',
    description: '',
    response: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  
  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCommand(prev => ({ ...prev, [name]: value }));
  };
  
  const addCommand = () => {
    if (!newCommand.command || !newCommand.response) {
      toast.error("Command name and response are required");
      return;
    }
    
    // Validate command format
    if (!newCommand.command.startsWith('/')) {
      toast.error("Command must start with / character");
      return;
    }
    
    const id = `cmd-${Date.now()}`;
    const updatedCommands = [
      ...commands, 
      { 
        id, 
        ...newCommand, 
        isEnabled: true 
      }
    ];
    
    setCommands(updatedCommands);
    onSave(botId, updatedCommands);
    
    // Reset form
    setNewCommand({
      command: '',
      description: '',
      response: ''
    });
    setIsAdding(false);
    toast.success("Command added successfully");
  };
  
  const removeCommand = (id: string) => {
    const updatedCommands = commands.filter(cmd => cmd.id !== id);
    setCommands(updatedCommands);
    onSave(botId, updatedCommands);
    toast.success("Command removed successfully");
  };
  
  const toggleCommand = (id: string) => {
    const updatedCommands = commands.map(cmd => {
      if (cmd.id === id) {
        return { ...cmd, isEnabled: !cmd.isEnabled };
      }
      return cmd;
    });
    
    setCommands(updatedCommands);
    onSave(botId, updatedCommands);
    toast.success(`Command ${updatedCommands.find(cmd => cmd.id === id)?.isEnabled ? 'enabled' : 'disabled'}`);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Command size={20} />
          Bot Commands
        </CardTitle>
        <CardDescription>
          Configure commands that your bot can respond to
        </CardDescription>
      </CardHeader>
      <CardContent>
        {commands.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commands.map((cmd) => (
                <TableRow key={cmd.id}>
                  <TableCell className="font-mono">{cmd.command}</TableCell>
                  <TableCell>{cmd.description}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      cmd.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cmd.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleCommand(cmd.id)}
                        title={cmd.isEnabled ? "Disable command" : "Enable command"}
                      >
                        <Code size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeCommand(cmd.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete command"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare size={40} className="mx-auto mb-2 opacity-50" />
            <p>No commands have been added yet.</p>
          </div>
        )}
        
        {isAdding ? (
          <div className="mt-6 space-y-4 border rounded-lg p-4 bg-muted/20">
            <h3 className="text-lg font-medium">Add New Command</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="command" className="block text-sm font-medium mb-1">Command</label>
                <Input 
                  id="command" 
                  name="command" 
                  value={newCommand.command} 
                  onChange={handleCommandChange} 
                  placeholder="/start"
                  className="font-mono"
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">Must start with / character</p>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <Input 
                  id="description" 
                  name="description" 
                  value={newCommand.description} 
                  onChange={handleCommandChange} 
                  placeholder="Starts the bot conversation"
                />
              </div>
            </div>
            <div>
              <label htmlFor="response" className="block text-sm font-medium mb-1">Response</label>
              <Textarea 
                id="response" 
                name="response" 
                value={newCommand.response} 
                onChange={handleCommandChange} 
                placeholder="Hello! I'm a bot. How can I help you today?"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={addCommand} className="flex items-center gap-2">
                <Save size={16} />
                <span>Save Command</span>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            className="mt-4 w-full"
            variant="outline"
          >
            <Plus size={16} className="mr-2" />
            Add New Command
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CommandManager;
