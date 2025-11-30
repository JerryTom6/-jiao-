
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Eye, Clock, MapPin, Home } from 'lucide-react';
import { MOCK_LISTINGS } from '../data';
import { UserRole } from '../types';

interface MyPostsProps {
  userRole: UserRole;
}

const MyPosts: React.FC<MyPostsProps> = ({ userRole }) => {
  const navigate = useNavigate();
  
  // Simulate current user ID based on role (matching data.ts mock data)
  const currentUserId = userRole === 'parent' ? 'p1' : 't1';
  
  const myListings = MOCK_LISTINGS.filter(l => l.authorId === currentUserId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 h-12 flex items-center justify-between border-b border-gray-100 pt-safe-top sticky top-0 z-50">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="-ml-2 p-2">
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="font-bold text-base text-gray-900 ml-2">
                {userRole === 'parent' ? '我的发布' : '我的履历'}
            </h1>
         </div>
         <button onClick={() => navigate('/')} className="p-2">
             <Home size={20} className="text-gray-800" />
         </button>
      </div>

      <div className="p-4 space-y-4">
        {myListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <p>暂无发布记录</p>
                <button onClick={() => navigate('/publish')} className="mt-4 text-wx-green font-bold">去发布</button>
            </div>
        ) : (
            myListings.map(item => (
                <div key={item.id} onClick={() => navigate(`/listing/${item.id}`)} className="bg-white p-4 rounded-xl shadow-sm relative active:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${item.verified ? 'bg-green-50 text-wx-green' : 'bg-gray-100 text-gray-500'}`}>
                            {item.verified ? '展示中' : '审核中'}
                        </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {item.description}
                    </div>

                    <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3">
                        <span className="flex items-center"><Clock size={12} className="mr-1"/> {item.timestamp}</span>
                        <span className="flex items-center"><Eye size={12} className="mr-1"/> {item.viewCount} 浏览</span>
                    </div>

                    <div className="flex border-t border-gray-100 pt-3 mt-2">
                        <button className="flex-1 flex items-center justify-center text-xs text-gray-600 font-medium active:text-wx-green">
                            <Edit2 size={14} className="mr-1.5" /> 编辑
                        </button>
                        <div className="w-px bg-gray-100 h-4 self-center mx-2"></div>
                        <button className="flex-1 flex items-center justify-center text-xs text-red-500 font-medium active:opacity-70">
                            <Trash2 size={14} className="mr-1.5" /> 下架
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MyPosts;
