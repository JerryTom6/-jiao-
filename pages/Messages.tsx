import React from 'react';
import { Bell } from 'lucide-react';
import { MOCK_CHATS } from '../data';
import { useNavigate } from 'react-router-dom';

const Messages: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-white">
      <header className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200 px-4 pt-12 pb-3 shadow-sm">
        <h1 className="font-semibold text-base text-center">消息 ({MOCK_CHATS.length})</h1>
      </header>

      <div className="divide-y divide-gray-100">
        {MOCK_CHATS.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="flex items-center p-4 active:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="relative">
              {chat.avatar === 'SYSTEM' ? (
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                    <Bell size={24} fill="currentColor" />
                </div>
              ) : (
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
              )}
              
              {chat.unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white shadow-sm">
                  {chat.unreadCount}
                </div>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-medium text-gray-900 truncate">{chat.name}</h3>
                <span className="text-[10px] text-gray-400">{chat.time}</span>
              </div>
              <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;