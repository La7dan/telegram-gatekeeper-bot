
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Users, MessagesSquare, Clock, Activity } from 'lucide-react';

interface DashboardData {
  dailyStats: {
    date: string;
    messages: number;
    users: number;
  }[];
  commandUsage: {
    command: string;
    count: number;
  }[];
  totalUsers: number;
  totalMessages: number;
  avgResponseTime: number;
}

interface AnalyticsDashboardProps {
  botId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ botId }) => {
  // Mock data for demonstration purposes
  const mockData: DashboardData = {
    dailyStats: [
      { date: 'Apr 04', messages: 120, users: 25 },
      { date: 'Apr 05', messages: 132, users: 28 },
      { date: 'Apr 06', messages: 101, users: 22 },
      { date: 'Apr 07', messages: 134, users: 29 },
      { date: 'Apr 08', messages: 190, users: 35 },
      { date: 'Apr 09', messages: 230, users: 45 },
      { date: 'Apr 10', messages: 210, users: 40 },
    ],
    commandUsage: [
      { command: '/start', count: 245 },
      { command: '/help', count: 186 },
      { command: '/weather', count: 125 },
      { command: '/stats', count: 84 },
      { command: '/youtube', count: 67 },
      { command: '/instagram', count: 52 },
    ],
    totalUsers: 425,
    totalMessages: 1240,
    avgResponseTime: 0.8,
  };

  // In a real implementation, we'd fetch this data for the specific bot ID

  const StatsCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h4 className="text-2xl font-bold mt-1">{value}</h4>
          </div>
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Analytics Dashboard
          </CardTitle>
          <CardDescription>
            View performance metrics and usage statistics for your bot
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard 
          title="Total Users" 
          value={mockData.totalUsers}
          icon={<Users size={20} />}
        />
        <StatsCard 
          title="Total Messages" 
          value={mockData.totalMessages}
          icon={<MessagesSquare size={20} />}
        />
        <StatsCard 
          title="Avg. Response Time" 
          value={`${mockData.avgResponseTime}s`}
          icon={<Clock size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="#8884d8" name="Messages" />
                <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Command Usage Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Popular Commands</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.commandUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="command" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Usage Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
