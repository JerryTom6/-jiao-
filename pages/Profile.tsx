
import React from 'react';
import { UserRole } from '../types';
import { ChevronRight, Settings, FileText, Heart, Shield, MessageSquareText, Briefcase, Receipt, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  userRole: UserRole;
}

const Profile: React.FC<ProfileProps> = ({ userRole }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-wx-bg">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-16 pb-8 flex items-center mb-2">
        <div className="relative">
            <img 
            src={userRole === 'parent' ? "https://picsum.photos/200/200?random=50" : "https://picsum.photos/200/200?random=12"} 
            alt="Profile" 
            className="w-16 h-16 rounded-lg object-cover mr-4 border border-gray-100"
            />
            <div className="absolute -bottom-1 -right-0 bg-wx-green rounded-full p-1 border-2 border-white" title="微信已授权">
                <Shield size={8} className="text-white fill-white" />
            </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{userRole === 'parent' ? '王先生 (家长)' : '陈大卫'}</h2>
          <div className="flex items-center mt-1">
             <span className="text-sm text-gray-500 mr-2">微信号: {userRole === 'parent' ? 'wang_parent' : 'math_dave'}</span>
          </div>
          <div className="mt-2 flex space-x-2">
             <div className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 uppercase border border-gray-200">
                {userRole === 'parent' ? '家长' : '大学生'}
             </div>
             {userRole === 'tutor' && (
                 <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] border border-blue-100 font-medium">
                    已认证：清华大学
                 </div>
             )}
          </div>
        </div>
        <ChevronRight className="text-gray-300" />
      </div>

      {/* Services Grid */}
      <div className="bg-white mb-2 p-4">
        <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            {userRole === 'parent' ? '我的服务' : '老师工具'}
        </h3>
        <div className="grid grid-cols-4 gap-4 text-center">
            <div onClick={() => navigate('/wallet')} className="flex flex-col items-center space-y-2 cursor-pointer active:opacity-70">
                <div className="w-8 h-8 bg-wx-green/10 rounded-full flex items-center justify-center text-wx-green">
                    <Wallet size={16} />
                </div>
                <span className="text-xs text-gray-600">我的钱包</span>
            </div>
            
            <div onClick={() => navigate('/my-posts')} className="flex flex-col items-center space-y-2 cursor-pointer active:opacity-70">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                    <FileText size={16} />
                </div>
                <span className="text-xs text-gray-600">{userRole === 'parent' ? '我的发布' : '我的履历'}</span>
            </div>
            
            {userRole === 'tutor' ? (
                <div onClick={() => navigate('/templates')} className="flex flex-col items-center space-y-2 cursor-pointer active:opacity-70">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-wx-green">
                        <MessageSquareText size={16} />
                    </div>
                    <span className="text-xs text-gray-600">应征模板</span>
                </div>
            ) : (
                <div onClick={() => navigate('/messages')} className="flex flex-col items-center space-y-2 cursor-pointer active:opacity-70">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                        <Briefcase size={16} />
                    </div>
                    <span className="text-xs text-gray-600">进行中</span>
                </div>
            )}
            
            <div onClick={() => navigate('/favorites')} className="flex flex-col items-center space-y-2 cursor-pointer active:opacity-70">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                    <Heart size={16} />
                </div>
                <span className="text-xs text-gray-600">收藏</span>
            </div>
        </div>
      </div>

      {/* List Items */}
      <div className="bg-white mb-2">
        {userRole === 'tutor' && (
             <div className="flex items-center p-4 active:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center mr-4">
                     <Shield size={18} className="text-green-600"/>
                </div>
                <span className="flex-1 text-sm text-gray-800">身份认证</span>
                <span className="text-xs text-wx-green mr-2">已通过</span>
                <ChevronRight size={16} className="text-gray-300" />
            </div>
        )}
        <div className="flex items-center p-4 active:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer">
          <Settings size={20} className="text-gray-600 mr-4" />
          <span className="flex-1 text-sm text-gray-800">设置</span>
          <ChevronRight size={16} className="text-gray-300" />
        </div>
      </div>
      
      <div className="text-center mt-8 px-4 pb-20">
         <button className="text-xs text-gray-400 font-medium bg-transparent p-2">退出登录</button>
      </div>

    </div>
  );
};

export default Profile;
