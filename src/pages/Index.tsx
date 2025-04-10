
import React from 'react';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
