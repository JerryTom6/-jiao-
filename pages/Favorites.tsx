
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Home, Star } from 'lucide-react';
import { MOCK_LISTINGS } from '../data';

const Favorites: React.FC = () => {
  const navigate = useNavigate();

  // Mock Favorites: Select a couple of random listings
  const favoriteListings = MOCK_LISTINGS.filter((_, i) => i % 2 !== 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white px-4 h-12 flex items-center justify-between border-b border-gray-100 pt-safe-top sticky top-0 z-50">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="-ml-2 p-2">
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="font-bold text-base text-gray-900 ml-2">我的收藏</h1>
         </div>
         <button onClick={() => navigate('/')} className="p-2">
             <Home size={20} className="text-gray-800" />
         </button>
      </div>

      <div className="p-4 space-y-3">
        {favoriteListings.length === 0 ? (
            <div className="text-center py-20 text-gray-400">暂无收藏内容</div>
        ) : (
            favoriteListings.map(listing => (
                <div 
                    key={listing.id} 
                    onClick={() => navigate(`/listing/${listing.id}`)}
                    className="bg-white p-4 rounded-xl shadow-sm flex flex-col active:bg-gray-50 transition-colors"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">{listing.title}</h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{listing.subjects[0]}</span>
                                <span className="text-[10px] text-gray-400">{listing.gradeLevel}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-red-500 font-bold text-sm">¥{listing.priceMin}/时</div>
                             <Star size={14} className="text-orange-400 fill-orange-400 ml-auto mt-1" />
                        </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                        <img src={listing.authorAvatar} className="w-5 h-5 rounded-full mr-2" />
                        <span className="mr-2">{listing.authorName}</span>
                        <MapPin size={10} className="mr-1" />
                        {listing.location.name}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
