
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Bell, Lock, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { FEE_RULES } from '../services/backend';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white px-4 h-12 flex items-center justify-between border-b border-gray-100 pt-safe-top sticky top-0 z-50">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="-ml-2 p-2">
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="font-bold text-base text-gray-900 ml-2">设置</h1>
         </div>
         <button onClick={() => navigate('/')} className="p-2">
             <Home size={20} className="text-gray-800" />
         </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Fee Rules Section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-50 bg-blue-50/30">
                <h3 className="font-bold text-sm text-gray-900 flex items-center">
                    <FileText size={16} className="text-blue-500 mr-2" />
                    平台服务费规则
                </h3>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 border-dashed">
                    <span className="text-gray-600">0 - {FEE_RULES.TIER_1.LIMIT}元</span>
                    <span className="font-medium text-gray-900">{(FEE_RULES.TIER_1.RATE * 100)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 border-dashed">
                    <span className="text-gray-600">{FEE_RULES.TIER_1.LIMIT} - {FEE_RULES.TIER_2.LIMIT}元</span>
                    <span className="font-medium text-gray-900">{(FEE_RULES.TIER_2.RATE * 100)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 border-dashed">
                    <span className="text-gray-600">{FEE_RULES.TIER_2.LIMIT}元以上</span>
                    <span className="font-medium text-gray-900">{(FEE_RULES.TIER_3.RATE * 100)}%</span>
                </div>
                 <div className="flex items-center justify-between text-sm py-2 pt-3">
                    <span className="text-gray-600 font-bold">单笔封顶</span>
                    <span className="font-bold text-wx-green">{FEE_RULES.MAX_FEE}元</span>
                </div>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    * 服务费在提现时扣除，用于维持平台服务器及人工审核成本。
                </p>
            </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-gray-50">
            <div className="p-4 flex items-center justify-between active:bg-gray-50">
                <div className="flex items-center">
                    <Bell size={18} className="text-gray-500 mr-3" />
                    <span className="text-sm text-gray-800">消息通知</span>
                </div>
                <div className="w-10 h-6 bg-wx-green rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
            </div>
            <div className="p-4 flex items-center justify-between active:bg-gray-50">
                <div className="flex items-center">
                    <Lock size={18} className="text-gray-500 mr-3" />
                    <span className="text-sm text-gray-800">隐私设置</span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
            </div>
             <div className="p-4 flex items-center justify-between active:bg-gray-50">
                <div className="flex items-center">
                    <ShieldCheck size={18} className="text-gray-500 mr-3" />
                    <span className="text-sm text-gray-800">实名认证</span>
                </div>
                <span className="text-xs text-gray-400">已认证</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
