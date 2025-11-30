
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Zap, Navigation, Clock, Star, ChevronDown, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';
import { MOCK_LISTINGS, CURRENT_USER_LOC } from '../data';
import { useNavigate } from 'react-router-dom';
import { wx, STORAGE_KEYS } from '../services/storage';

interface HomeProps {
  userRole: UserRole;
  switchRole: () => void;
}

// Haversine Distance Calculation (km)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10;
};

const Home: React.FC<HomeProps> = ({ userRole, switchRole }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [currentCity, setCurrentCity] = useState({ name: '北京', id: 'bj' });

  // Load city from storage on mount
  useEffect(() => {
    const savedCity = wx.getStorage(STORAGE_KEYS.CURRENT_CITY);
    if (savedCity) {
      setCurrentCity(savedCity);
    }
  }, []);

  // Filter listings based on role
  const targetType = userRole === 'parent' ? 'tutor_profile' : 'job_request';

  const processedListings = MOCK_LISTINGS
    .filter(item => item.type === targetType)
    .map(item => ({
      ...item,
      distance: calculateDistance(CURRENT_USER_LOC.lat, CURRENT_USER_LOC.lng, item.location.lat, item.location.lng),
      matchScore: Math.floor(Math.random() * 15) + 80 // Mock smart match score
    }))
    .filter(item => {
      // Search Text Filter
      if (searchText) {
          const lowerText = searchText.toLowerCase();
          const matches = item.title.includes(lowerText) || 
                          item.subjects.some(s => s.includes(lowerText)) ||
                          item.location.name.includes(lowerText);
          if (!matches) return false;
      }

      // Chip Filters
      if (activeFilter === 'nearby') return (item.distance || 0) < 5;
      if (activeFilter === 'high_pay') return (item.priceMin || 0) > 120;
      if (activeFilter === 'weekend') return item.schedule.some(s => s.day === '周六' || s.day === '周日');
      return true;
    })
    .sort((a, b) => {
      if (activeFilter === 'nearby') return (a.distance || 0) - (b.distance || 0);
      return 0; 
    });

  const handleCardClick = (id: string) => {
      navigate(`/listing/${id}`);
  };

  return (
    <div className="min-h-full pb-4 bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm pt-safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {userRole === 'tutor' ? '找学生' : '找老师'}
              </h1>
              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                <button 
                  onClick={() => navigate('/city-select')} 
                  className="flex items-center active:opacity-60"
                >
                  <MapPin size={10} className="mr-1" />
                  <span className="font-bold text-gray-800 mr-1">{currentCity.name}</span>
                  <ChevronDown size={10} />
                </button>
                <div className="h-3 w-[1px] bg-gray-300 mx-2"></div>
                <span 
                  onClick={switchRole}
                  className="text-wx-green font-medium cursor-pointer border border-wx-green px-1.5 rounded-[4px] scale-90 origin-left"
                >
                  切换身份
                </span>
              </div>
            </div>
            {userRole === 'tutor' && (
                <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Zap size={12} className="mr-1 fill-orange-600" />
                    优选
                </div>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={userRole === 'parent' ? "试试 '三年级数学'" : "搜索区域、科目..."}
              className="w-full bg-gray-100 text-sm py-2.5 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-wx-green transition-shadow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Filter Chips */}
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
            <button
               onClick={() => setActiveFilter('all')}
               className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                 activeFilter === 'all' ? 'bg-wx-green text-white' : 'bg-gray-100 text-gray-600'
               }`}
            >
                推荐
            </button>
            <button
               onClick={() => setActiveFilter('nearby')}
               className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${
                 activeFilter === 'nearby' ? 'bg-wx-green text-white' : 'bg-gray-100 text-gray-600'
               }`}
            >
                <Navigation size={10} className="mr-1" /> 离我最近
            </button>
            {userRole === 'tutor' && (
                <>
                <button
                    onClick={() => setActiveFilter('high_pay')}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        activeFilter === 'high_pay' ? 'bg-wx-green text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    高预算
                </button>
                <button
                    onClick={() => setActiveFilter('weekend')}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        activeFilter === 'weekend' ? 'bg-wx-green text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    周末
                </button>
                </>
            )}
          </div>
        </div>
      </header>

      {/* Listings Content */}
      <div className="p-4 space-y-3">
        {processedListings.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
                <p>该区域暂无需求。</p>
            </div>
        ) : processedListings.map((listing) => (
          <div 
            key={listing.id} 
            onClick={() => handleCardClick(listing.id)}
            className="bg-white p-4 rounded-xl shadow-sm relative overflow-hidden active:scale-[0.99] transition-transform"
          >
            {/* Match Badge for Tutors */}
            {userRole === 'tutor' && listing.matchScore && listing.matchScore > 85 && (
                <div className="absolute top-0 right-0 bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center">
                    <Star size={10} className="mr-1 fill-red-500" />
                    匹配度 {listing.matchScore}%
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-2 pr-16">
               <h3 className="font-bold text-gray-900 text-[15px] leading-tight line-clamp-1">
                   {listing.title}
               </h3>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{listing.subjects[0]}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{listing.gradeLevel}</span>
                {listing.distance && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded flex items-center">
                        <Navigation size={8} className="mr-0.5" />
                        {listing.distance}km
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                {listing.description}
            </p>

            {/* Logistics Grid */}
            <div className="bg-gray-50 rounded-lg p-2 mb-3 grid grid-cols-2 gap-y-2">
                 <div className="flex items-center text-xs text-gray-600">
                    <Clock size={12} className="mr-1.5 text-gray-400" />
                    <span className="truncate">
                        {listing.schedule.length > 0 ? listing.schedule.map(s => `${s.day} ${s.periods[0]}`).join(', ') : '时间灵活'}
                    </span>
                 </div>
                 <div className="flex items-center text-xs text-gray-600">
                    <MapPin size={12} className="mr-1.5 text-gray-400" />
                    <span className="truncate">{listing.location.name}</span>
                 </div>
            </div>

            {/* Footer / Action */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-1">
               <div className="flex items-center space-x-2">
                   <img src={listing.authorAvatar} className="w-6 h-6 rounded-full bg-gray-200" alt="" />
                   <span className="text-xs text-gray-500">{listing.authorName}</span>
                   {listing.verified && <CheckCircle size={10} className="text-wx-green fill-wx-green text-white" />}
               </div>
               
               <div className="flex items-center space-x-3">
                   <div className="text-red-500 font-bold text-lg">
                       <span className="text-xs font-normal text-gray-400 mr-0.5">¥</span>
                       {listing.priceMin}{listing.priceMax ? `-${listing.priceMax}` : ''}
                       <span className="text-[10px] text-gray-400 font-normal">/时</span>
                   </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
