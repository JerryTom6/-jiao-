
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Share2, MoreHorizontal, User, Shield, CheckCircle2, MessageSquare, CreditCard, Home } from 'lucide-react';
import { MOCK_LISTINGS, CURRENT_USER_LOC } from '../data';
import { UserRole } from '../types';

interface ListingDetailProps {
  userRole: UserRole;
}

const ListingDetail: React.FC<ListingDetailProps> = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = MOCK_LISTINGS.find(l => l.id === id);

  if (!listing) return <div className="p-10 text-center">未找到需求</div>;

  // Calculate distance mock
  const distance = 1.2; // Fixed mock for detail view

  const handleAction = () => {
    if (userRole === 'parent') {
        // Parent booking flow
        navigate(`/order-confirm/${listing.id}`);
    } else {
        // Tutor apply flow
        navigate(`/chat/${listing.id}`);
    }
  };

  const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const PERIODS = ['上午', '下午', '晚上'];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-12 pt-safe-top">
        <button onClick={() => navigate(-1)} className="p-1 -ml-2">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-base font-bold text-gray-800">
            {listing.type === 'job_request' ? '需求详情' : '老师主页'}
        </h1>
        <button onClick={() => navigate('/')} className="p-1">
          <Home size={20} className="text-gray-800" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Title & Price */}
        <div>
           <div className="flex justify-between items-start">
               <h1 className="text-xl font-bold text-gray-900 leading-snug flex-1 mr-4">{listing.title}</h1>
               <div className="text-right">
                   <div className="text-red-500 font-bold text-xl">
                       <span className="text-xs">¥</span>{listing.priceMin}
                   </div>
                   <div className="text-[10px] text-gray-400">/小时</div>
               </div>
           </div>
           <div className="flex items-center space-x-2 mt-2">
               <div className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">{listing.gradeLevel}</div>
               {listing.subjects.map(s => (
                   <div key={s} className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded">{s}</div>
               ))}
               <div className="flex items-center text-[10px] text-gray-400 ml-auto">
                   <Clock size={10} className="mr-1" />
                   {listing.timestamp} · 浏览 {listing.viewCount}
               </div>
           </div>
        </div>

        {/* Author Card */}
        <div className="bg-gray-50 rounded-xl p-3 flex items-center">
            <img src={listing.authorAvatar} className="w-12 h-12 rounded-full mr-3 bg-gray-200" alt="avatar" />
            <div className="flex-1">
                <div className="flex items-center">
                    <span className="font-bold text-sm text-gray-900 mr-2">{listing.authorName}</span>
                    {listing.verified && <Shield size={12} className="text-wx-green fill-wx-green" />}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                    {listing.type === 'job_request' ? '信誉极好' : '清华大学 · 数学系'}
                </div>
            </div>
            <button className="text-wx-green border border-wx-green text-xs px-3 py-1 rounded-full font-medium">
                查看主页
            </button>
        </div>

        {/* Description */}
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">详细描述</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {listing.description}
            </p>
        </div>

        {/* Schedule Grid */}
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">
                {listing.type === 'job_request' ? '期望上课时间' : '可授课时间'}
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                    <div className="p-2 text-[10px] text-gray-400"></div>
                    {WEEKDAYS.map(d => <div key={d} className="p-2 text-[10px] text-center font-bold text-gray-600 border-l border-gray-200">{d.replace('周','')}</div>)}
                </div>
                {PERIODS.map(p => (
                    <div key={p} className="grid grid-cols-8 border-b last:border-0 border-gray-200">
                        <div className="p-2 text-[10px] text-center text-gray-500 bg-gray-50 border-r border-gray-200 flex items-center justify-center">{p}</div>
                        {WEEKDAYS.map(d => {
                            const isSelected = listing.schedule.some(s => s.day === d && s.periods.includes(p as any));
                            return (
                                <div key={d} className="border-l border-gray-100 h-8 relative">
                                    {isSelected && (
                                        <div className="absolute inset-1 bg-green-100 rounded-sm flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-wx-green" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>

        {/* Location (Mock Map) */}
        <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">地点</h3>
            <div className="bg-blue-50 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                 <MapPin className="text-blue-500 z-10" size={32} />
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 to-transparent"></div>
                 <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs text-gray-600 shadow-sm">
                     {listing.location.address} (距您 {distance}km)
                 </div>
            </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 pb-safe flex items-center justify-between z-50">
          <div className="flex space-x-6 px-4">
              <div className="flex flex-col items-center text-gray-400">
                  <Share2 size={20} />
                  <span className="text-[10px]">分享</span>
              </div>
              <div className="flex flex-col items-center text-gray-400">
                  <User size={20} />
                  <span className="text-[10px]">关注</span>
              </div>
          </div>
          
          <button 
            onClick={handleAction}
            className={`px-8 py-3 rounded-full font-bold shadow-lg flex items-center active:bg-green-700 transition-colors ${
                userRole === 'parent' 
                ? 'bg-wx-green text-white shadow-green-100' 
                : 'bg-blue-500 text-white shadow-blue-100'
            }`}
          >
             {userRole === 'parent' ? (
                 <>
                   <CreditCard size={18} className="mr-2" />
                   预约试听
                 </>
             ) : (
                 <>
                    <MessageSquare size={18} className="mr-2" />
                    立即应征
                 </>
             )}
          </button>
      </div>
    </div>
  );
};

export default ListingDetail;
