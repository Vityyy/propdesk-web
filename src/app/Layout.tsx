import { useState } from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { useTheme } from './context/ThemeContext';

export function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="bg-deep flex flex-col h-screen w-screen overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
      <div className={`absolute top-0 left-1/4 w-[600px] h-[400px] ${theme === 'dark' ? 'bg-[#928dd3]/5' : 'bg-[#928dd3]/10'} blur-[120px] rounded-full pointer-events-none`} />
      <div className={`absolute bottom-0 right-1/4 w-[500px] h-[300px] ${theme === 'dark' ? 'bg-[#928dd3]/3' : 'bg-[#928dd3]/5'} blur-[100px] rounded-full pointer-events-none`} />
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}