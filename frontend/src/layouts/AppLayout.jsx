import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

const AppLayout = ({ children, showSidebar = true, showFooter = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background font-body text-textPrimary selection:bg-primary/20 selection:text-primary">
      {/* Top Navbar */}
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="flex-1 flex relative">
        {/* Collapsible Main Navigation Sidebar */}
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}

        {/* Main Content View */}
        <main 
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? (isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56') : ''
          } flex flex-col min-w-0`}
        >
          <div className="flex-1 p-3 sm:p-4 lg:p-5 max-w-7xl w-full mx-auto">
            {children}
          </div>

          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
