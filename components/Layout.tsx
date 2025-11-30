import React from 'react';
import { Home, MessageSquare, User, PlusCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center justify-center w-full h-full space-y-1 ${
      isActive ? 'text-wx-green' : 'text-gray-400'
    }`;
  };

  return (
    <div className="flex flex-col h-screen bg-wx-bg max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-wx-border">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full h-[60px] bg-white border-t border-wx-border flex justify-around items-center z-50 pb-safe">
        <button onClick={() => navigate('/')} className={getTabClass('/')}>
          <Home size={24} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">首页</span>
        </button>
        
        <button onClick={() => navigate('/publish')} className={getTabClass('/publish')}>
          <PlusCircle size={24} strokeWidth={location.pathname === '/publish' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">发布</span>
        </button>

        <button onClick={() => navigate('/messages')} className={getTabClass('/messages')}>
          <MessageSquare size={24} strokeWidth={location.pathname === '/messages' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">消息</span>
        </button>

        <button onClick={() => navigate('/profile')} className={getTabClass('/profile')}>
          <User size={24} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;