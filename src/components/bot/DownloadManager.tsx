
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Download, FolderOpen, FileDown, Settings, Trash2, Check, X, Clock, Folder } from 'lucide-react';

interface DownloadItem {
  id: string;
  fileName: string;
  fileSize: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  type: string;
}

interface DownloadManagerProps {
  botId: string;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ botId }) => {
  const [downloadPath, setDownloadPath] = useState<string>('/downloads');
  const [maxFileSize, setMaxFileSize] = useState<string>('50');
  const [autoDownload, setAutoDownload] = useState<boolean>(true);
  
  // Mock download history for demonstration
  const [downloadHistory, setDownloadHistory] = useState<DownloadItem[]>([
    {
      id: 'download-1',
      fileName: 'chat_history_2025-04-08.json',
      fileSize: '1.2 MB',
      status: 'completed',
      date: '2025-04-08',
      type: 'JSON'
    },
    {
      id: 'download-2',
      fileName: 'user_data_export.csv',
      fileSize: '450 KB',
      status: 'completed',
      date: '2025-04-07',
      type: 'CSV'
    },
    {
      id: 'download-3',
      fileName: 'media_attachments.zip',
      fileSize: '8.5 MB',
      status: 'pending',
      date: '2025-04-10',
      type: 'ZIP'
    }
  ]);

  const handleDownloadPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadPath(e.target.value);
  };

  const handleMaxFileSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFileSize(e.target.value);
  };

  const handleAutoDownloadToggle = () => {
    setAutoDownload(!autoDownload);
  };

  const saveSettings = () => {
    toast.success('Download settings saved successfully');
  };

  const handleDownload = (id: string) => {
    toast.success('Download started');
    // In a real implementation, this would trigger the actual download
  };

  const handleDeleteDownload = (id: string) => {
    setDownloadHistory(downloadHistory.filter(item => item.id !== id));
    toast.success('Download removed from history');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download size={20} />
            Download Manager
          </CardTitle>
          <CardDescription>
            Configure download settings and manage downloaded files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="downloadPath" className="block text-sm font-medium mb-1">Download Path</label>
                <div className="flex">
                  <Input 
                    id="downloadPath" 
                    value={downloadPath} 
                    onChange={handleDownloadPathChange} 
                    className="rounded-r-none"
                  />
                  <Button variant="outline" className="rounded-l-none">
                    <FolderOpen size={16} />
                  </Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Directory where files will be saved
                </p>
              </div>
              
              <div>
                <label htmlFor="maxFileSize" className="block text-sm font-medium mb-1">Max File Size (MB)</label>
                <Input 
                  id="maxFileSize" 
                  type="number"
                  value={maxFileSize} 
                  onChange={handleMaxFileSizeChange}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum allowed file size for downloads
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                className={`mr-2 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  autoDownload ? 'bg-primary' : 'bg-input'
                }`}
                onClick={handleAutoDownloadToggle}
                role="switch"
                aria-checked={autoDownload}
              >
                <span
                  className={`${
                    autoDownload ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 rounded-full bg-background transition-transform`}
                />
              </button>
              <label htmlFor="autoDownload" className="text-sm font-medium">
                Auto-download received files
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={saveSettings}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
      
      {/* Download History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Download History</CardTitle>
          <CardDescription>
            Files downloaded from this bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          {downloadHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloadHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileDown size={16} />
                      {item.fileName}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.fileSize}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'completed' ? <Check size={12} /> : 
                         item.status === 'pending' ? <Clock size={12} /> : 
                         <X size={12} />}
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.status === 'completed' && (
                          <Button variant="ghost" size="icon" onClick={() => handleDownload(item.id)}>
                            <Download size={16} />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteDownload(item.id)}
                          className="text-red-500 hover:text-red-700"
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
              <Download size={40} className="mx-auto mb-2 opacity-50" />
              <p>No download history available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadManager;
