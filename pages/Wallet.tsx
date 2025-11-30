
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Shield, Wallet as WalletIcon, HelpCircle, AlertCircle } from 'lucide-react';
import { wx } from '../services/storage';
import { WalletState, WithdrawalPreview } from '../types';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletState>({ balance: 0, transactions: [] });
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [preview, setPreview] = useState<WithdrawalPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setWallet(wx.getWallet());
  }, []);

  // Debounced fee calculation
  useEffect(() => {
      const val = parseFloat(withdrawAmount);
      if (!isNaN(val) && val > 0) {
          wx.cloud.callFunction('getFeePreview', { amount: val }).then((res: any) => {
              setPreview(res.result);
          });
      } else {
          setPreview(null);
      }
  }, [withdrawAmount]);

  const handleWithdraw = () => {
    const val = parseFloat(withdrawAmount);
    if (!val || val <= 0) return;
    if (val > wallet.balance) {
      wx.showToast('余额不足', 'none');
      return;
    }
    
    wx.showModal({
      title: '提现确认',
      content: `申请提现 ¥${val}\n手续费 ¥${preview?.fee || 0}\n实际到账 ¥${preview?.netAmount || 0}`,
      success: (res) => {
        if (res.confirm) {
          setIsLoading(true);
          wx.showLoading({ title: '处理中' });
          
          wx.cloud.callFunction('withdraw', { amount: val })
            .then((res: any) => {
                setWallet(res.result);
                setWithdrawAmount('');
                setPreview(null);
                wx.showToast('提现申请已提交');
            })
            .catch((err) => {
                wx.showToast(err.message || '提现失败', 'none');
            })
            .finally(() => {
                setIsLoading(false);
                wx.hideLoading();
            });
        }
      }
    });
  };

  const handleAddFunds = () => {
      // Debug helper for testing
      wx.cloud.callFunction('debugAddFunds', { amount: 1000 }).then((res:any) => {
          setWallet(res.result);
          wx.showToast('已充值1000元(测试)', 'none');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-wx-green h-52 px-6 pt-safe-top relative overflow-hidden transition-all">
        <div className="flex items-center text-white mb-6">
           <button onClick={() => navigate(-1)} className="-ml-2 p-2">
             <ChevronLeft size={24} />
           </button>
           <h1 className="font-bold text-base ml-2">我的钱包</h1>
           <button onClick={handleAddFunds} className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">测试充值</button>
        </div>
        
        <div className="text-white relative z-10">
           <div className="text-sm opacity-80 mb-1">可提现余额 (元)</div>
           <div className="text-4xl font-bold font-mono">{wallet.balance.toFixed(2)}</div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10">
           <WalletIcon size={140} className="text-white transform translate-x-10 translate-y-10" />
        </div>
      </div>

      {/* Withdraw Action Area */}
      <div className="bg-white m-4 rounded-xl p-4 shadow-sm -mt-10 relative z-20">
         <div className="text-xs text-gray-500 mb-2 font-bold">提现金额</div>
         <div className="flex items-center border-b border-gray-100 pb-2 mb-3">
             <span className="text-2xl font-bold text-gray-900 mr-2">¥</span>
             <input 
                type="number" 
                className="flex-1 text-2xl font-bold text-gray-900 outline-none placeholder-gray-200"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
             />
             <button 
                onClick={() => setWithdrawAmount(wallet.balance.toString())}
                className="text-xs text-blue-600 font-medium"
             >
                 全部
             </button>
         </div>

         {/* Fee Preview */}
         {preview && (
             <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-500 mb-4 flex justify-between items-center">
                 <span>服务费 ({preview.rateApplied}): <span className="text-orange-500">-¥{preview.fee}</span></span>
                 <span>预计到账: <span className="text-wx-green font-bold">¥{preview.netAmount}</span></span>
             </div>
         )}

         <button 
           onClick={handleWithdraw}
           disabled={isLoading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
           className="w-full bg-wx-green text-white py-3 rounded-lg font-bold shadow-lg shadow-green-100 disabled:opacity-50 disabled:shadow-none active:scale-[0.99] transition-all"
         >
           {isLoading ? '处理中...' : '确认提现'}
         </button>

         <div className="mt-3 flex items-center justify-center text-[10px] text-gray-400">
             <Shield size={10} className="mr-1" />
             微信支付安全保障 · <span className="ml-1 underline cursor-pointer" onClick={() => navigate('/settings')}>查看费率规则</span>
         </div>
      </div>

      {/* Fee Rules Card */}
      <div className="mx-4 mb-4 bg-blue-50 rounded-lg p-3 flex items-start">
          <AlertCircle size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
              <p className="font-bold mb-1">阶梯服务费说明：</p>
              <ul className="list-disc pl-3 space-y-0.5 opacity-80">
                  <li>0 - 1000元：费率 5%</li>
                  <li>1000 - 5000元：费率 3%</li>
                  <li>5000元以上：费率 1%</li>
                  <li>单笔封顶 50元</li>
              </ul>
          </div>
      </div>

      {/* Transactions */}
      <div className="flex-1 bg-white pb-safe">
         <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
             <h3 className="text-sm font-bold text-gray-800">交易明细</h3>
         </div>
         
         <div className="divide-y divide-gray-50">
            {wallet.transactions.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    暂无交易记录
                </div>
            ) : (
                wallet.transactions.map((tx) => (
                    <div key={tx.id} className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                tx.type === 'payment' || tx.type === 'withdrawal' ? 'bg-gray-100' : 'bg-orange-50'
                            }`}>
                                {tx.type === 'withdrawal' ? (
                                    <ArrowUpRight size={18} className="text-gray-600" />
                                ) : (
                                    <ArrowDownLeft size={18} className={tx.type === 'income' ? 'text-orange-500' : 'text-gray-600'} />
                                )}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">{tx.title}</div>
                                <div className="text-xs text-gray-400 flex items-center mt-0.5">
                                    {tx.date} 
                                    {tx.fee && <span className="ml-2 bg-gray-100 px-1 rounded text-[10px]">含服务费 ¥{tx.fee}</span>}
                                </div>
                            </div>
                        </div>
                        <div className={`font-bold text-base font-mono ${
                             tx.amount > 0 ? 'text-orange-500' : 'text-gray-900'
                        }`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                        </div>
                    </div>
                ))
            )}
         </div>
      </div>
    </div>
  );
};

export default Wallet;
