
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MapPin } from 'lucide-react';
import { CityGroup } from '../types';
import { wx, STORAGE_KEYS } from '../services/storage';

const CITY_DATA: CityGroup[] = [
  { letter: 'B', list: [{ name: '北京', id: 'bj' }, { name: '保定', id: 'bd' }] },
  { letter: 'C', list: [{ name: '成都', id: 'cd' }, { name: '重庆', id: 'cq' }, { name: '长沙', id: 'cs' }] },
  { letter: 'G', list: [{ name: '广州', id: 'gz' }, { name: '贵阳', id: 'gy' }] },
  { letter: 'H', list: [{ name: '杭州', id: 'hz' }, { name: '合肥', id: 'hf' }] },
  { letter: 'N', list: [{ name: '南京', id: 'nj' }, { name: '宁波', id: 'nb' }] },
  { letter: 'S', list: [{ name: '上海', id: 'sh' }, { name: '深圳', id: 'sz' }, { name: '苏州', id: 'su' }] },
  { letter: 'T', list: [{ name: '天津', id: 'tj' }] },
  { letter: 'W', list: [{ name: '武汉', id: 'wh' }] },
  { letter: 'X', list: [{ name: '西安', id: 'xa' }] },
];

const HOT_CITIES = [
  { name: '北京', id: 'bj' },
  { name: '上海', id: 'sh' },
  { name: '广州', id: 'gz' },
  { name: '深圳', id: 'sz' },
];

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  const [activeLetter, setActiveLetter] = useState('');

  const handleSelect = (city: { name: string, id: string }) => {
    wx.setStorage(STORAGE_KEYS.CURRENT_CITY, city);
    navigate(-1);
  };

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    const element = document.getElementById(`anchor-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 pt-safe-top">
        <div className="flex items-center px-3 h-12 border-b border-gray-100">
           <button onClick={() => navigate(-1)} className="p-2 -ml-2">
             <ChevronLeft size={24} className="text-gray-900" />
           </button>
           <span className="font-bold text-base text-gray-900 ml-2">选择城市</span>
        </div>
        
        {/* Search */}
        <div className="p-3 bg-white">
          <div className="bg-gray-100 rounded-lg flex items-center px-3 py-2">
             <Search size={16} className="text-gray-400 mr-2" />
             <input type="text" placeholder="输入城市名查询" className="bg-transparent text-sm w-full outline-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative pb-safe">
        {/* Current Location */}
        <div className="bg-white p-4 mb-2">
           <div className="text-xs text-gray-500 mb-3">当前定位</div>
           <button className="flex items-center space-x-1 px-4 py-2 bg-gray-50 rounded-md border border-gray-100">
              <MapPin size={14} className="text-wx-green" />
              <span className="text-sm font-bold text-gray-800">北京市</span>
           </button>
        </div>

        {/* Hot Cities */}
        <div className="bg-white p-4 mb-2">
           <div className="text-xs text-gray-500 mb-3">热门城市</div>
           <div className="grid grid-cols-3 gap-3">
              {HOT_CITIES.map(city => (
                <button 
                  key={city.id}
                  onClick={() => handleSelect(city)} 
                  className="py-2.5 bg-gray-50 rounded text-sm text-gray-800 text-center font-medium"
                >
                  {city.name}
                </button>
              ))}
           </div>
        </div>

        {/* Index List */}
        <div className="bg-white">
           {CITY_DATA.map(group => (
             <div key={group.letter} id={`anchor-${group.letter}`}>
               <div className="bg-gray-50 px-4 py-1 text-xs font-bold text-gray-500 sticky top-0">
                 {group.letter}
               </div>
               <div className="divide-y divide-gray-100 pl-4">
                 {group.list.map(city => (
                   <button 
                     key={city.id}
                     onClick={() => handleSelect(city)}
                     className="w-full text-left py-4 text-base text-gray-900 active:bg-gray-50"
                   >
                     {city.name}
                   </button>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* Sidebar Index */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center space-y-1 py-4 w-8">
        {CITY_DATA.map(group => (
          <button 
            key={group.letter}
            onClick={() => scrollToLetter(group.letter)}
            className={`text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
              activeLetter === group.letter ? 'bg-wx-green text-white' : 'text-gray-500'
            }`}
          >
            {group.letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CitySelect;
