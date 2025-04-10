
import React, { useState } from 'react';
import { CommandLog } from '@/utils/botCommands';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDownIcon, FilterIcon, XCircleIcon, CheckCircleIcon } from "lucide-react";

interface CommandHistoryProps {
  logs: CommandLog[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ logs }) => {
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [selectedLog, setSelectedLog] = useState<CommandLog | null>(null);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'success') return log.success;
    if (filter === 'failed') return !log.success;
    return true;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleViewDetails = (log: CommandLog) => {
    setSelectedLog(log);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Command History</h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <FilterIcon size={14} />
              <span>Filter</span>
              <ChevronDownIcon size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('all')}>
              All Commands
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('success')}>
              Successful Commands
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('failed')}>
              Failed Commands
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Command</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No command logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {log.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell>{log.username}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded">{log.command}</code>
                  </TableCell>
                  <TableCell>
                    {log.success ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(log)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Command Details</DialogTitle>
            <DialogDescription>
              Command executed at {selectedLog?.timestamp.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-24 text-sm font-medium text-muted-foreground">Status:</div>
                <div className="flex items-center">
                  {selectedLog.success ? (
                    <>
                      <CheckCircleIcon size={16} className="text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">Success</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon size={16} className="text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">Failed</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-24 text-sm font-medium text-muted-foreground">User:</div>
                <div>{selectedLog.username} ({selectedLog.userId})</div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-24 text-sm font-medium text-muted-foreground">Command:</div>
                <code className="bg-muted px-2 py-1 rounded">{selectedLog.command}</code>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Response:</div>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                  {selectedLog.response}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommandHistory;
