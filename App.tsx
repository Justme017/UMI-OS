import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Settings } from './pages/Settings';
import { Workspace } from './pages/Workspace';
import { View, User } from './types';

// Mock User Data
const mockUser: User = {
  firstName: 'Josh',
  lastName: 'Doe',
  email: 'josh.doe@example.com',
  bio: 'Product Designer based in San Francisco. Interested in AI, brutalist architecture, and jazz.',
  avatarInitials: 'JD'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('workspace');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Update DOM for Tailwind Dark Mode
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] dark:bg-[#050505] overflow-hidden selection:bg-primary/20 selection:text-primary-hover">
      
      {/* Mobile Nav Toggle (Simplified for this demo) */}
      
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 h-full relative overflow-hidden transition-all duration-300">
        {currentView === 'workspace' && <Workspace />}
        {currentView === 'settings' && <Settings user={mockUser} />}
      </main>

    </div>
  );
};

export default App;