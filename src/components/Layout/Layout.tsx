import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UploadModal } from '../Upload/UploadModal';
import { NotificationToast } from '../Common/NotificationToast';

export const Layout: React.FC = () => {
  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <UploadModal />
      <NotificationToast />
    </div>
  );
};