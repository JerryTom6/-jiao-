
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Wallet, Lock, Home } from 'lucide-react';
import { MOCK_LISTINGS } from '../data';
import { wx } from '../services/storage';
import { Backend } from '../services/backend';

const SERVICE_FEE_RATE = 0.05; // 5% platform fee

const OrderConfirm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = MOCK_LISTINGS.find(l => l.id === id);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!listing) return <div>未找到订单信息</div>;

  // Calculate pricing
  const basePrice = listing.priceMin || 100; // Mock base price
  const hours = 2; // Mock hours for a trial session
  const tuitionFee = basePrice * hours;
  const serviceFee = Math.round(tuitionFee * SERVICE_FEE_RATE);
  const totalAmount = tuitionFee + serviceFee;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // 1. Simulate getting user credentials
    wx.login({
      success: (res) => {
        
        // 2. Simulate Pre-pay order creation (backend step)
        wx.showLoading({ title: '正在创建订单' });
        
        setTimeout(() => {
          wx.hideLoading();
          
          // 3. Trigger WeChat Pay
          wx.requestPayment({
            timeStamp: Date.now().toString(),
            nonceStr: 'random_nonce',
            package: `prepay_id=mock_id (课时费托管: ¥${totalAmount})`,
            signType: 'MD5',
            paySign: 'mock_sign',
            success: () => {
              
              // 4. Update backend state via "Cloud Function"
              // In reality this happens via webhook from WeChat Pay to Server
              Backend.processPayment(totalAmount, `支付课时费 - ${listing.title}`);
              
              setIsProcessing(false);
              wx.showToast('支付成功', 'success');
              
              // 5. Navigate back to Home
              setTimeout(() => {
                 navigate('/'); 
              }, 1500);
            },
            fail: () => {
              setIsProcessing(false);
              wx.showToast('支付已取消', 'none');
            }
          });
        }, 800);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 h-12 flex items-center justify-between border-b border-gray-100 pt-safe-top sticky top-0">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="-ml-2 p-2">
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="font-bold text-base text-gray-900 ml-2">确认交易</h1>
         </div>
         <button onClick={() => navigate('/')} className="p-2">
             <Home size={20} className="text-gray-800" />
         </button>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Product Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm text-gray-500 mb-4">商品信息</h3>
            <div className="flex items-start">
                <img src={listing.authorAvatar} className="w-16 h-16 rounded-lg bg-gray-200 object-cover mr-3" alt="" />
                <div className="flex-1">
                    <h2 className="font-bold text-gray-900 text-sm mb-1">{listing.title}</h2>
                    <p className="text-xs text-gray-500 mb-2">预约讲师：{listing.authorName}</p>
                    <div className="inline-block bg-green-50 text-wx-green text-[10px] px-2 py-0.5 rounded">
                        预约试听 (2小时)
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-sm font-bold">¥{tuitionFee}</span>
                </div>
            </div>
        </div>

        {/* Fee Breakdown */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">课时费 (托管)</span>
                <span className="font-medium">¥{tuitionFee}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center">
                    平台服务费 (5%)
                    <ShieldCheck size={12} className="text-gray-400 ml-1" />
                </span>
                <span className="font-medium">¥{serviceFee}</span>
            </div>
            <div className="h-px bg-gray-100 my-2"></div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">合计</span>
                <span className="font-bold text-xl text-red-500">¥{totalAmount}</span>
            </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start text-xs text-gray-500 px-2">
            <Lock size={12} className="mr-2 mt-0.5 text-wx-green flex-shrink-0" />
            <p>
                您的资金将由平台<span className="text-wx-green font-bold">全程托管</span>。
                老师完成课程并经您确认签到后，费用才会打入老师账户。
                若试听不满意，支持全额退款。
            </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white p-4 border-t border-gray-100 pb-safe">
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-wx-green text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-100 flex items-center justify-center space-x-2 active:bg-green-700 transition-colors"
          >
              <Wallet size={18} />
              <span>微信支付 ¥{totalAmount}</span>
          </button>
      </div>
    </div>
  );
};

export default OrderConfirm;
