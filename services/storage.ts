
import { WalletState, Transaction, WithdrawalPreview } from '../types';
import { Backend } from './backend';

// Simulated WeChat Native APIs & Client SDK

const MOCK_WALLET: WalletState = {
  balance: 0.00,
  transactions: []
};

export const STORAGE_KEYS = {
  USER_ROLE: 'wetutor_user_role',
  CURRENT_CITY: 'wetutor_current_city',
  DRAFT_POSTING: 'wetutor_draft_posting',
  WALLET: 'wetutor_wallet_data'
};

export const wx = {
  // Storage API
  setStorage: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage Save Error', e);
    }
  },
  
  getStorage: (key: string) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      return null;
    }
  },

  removeStorage: (key: string) => {
    localStorage.removeItem(key);
  },

  // Media API
  chooseImage: (callback: (res: { tempFilePaths: string[] }) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false; 
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        callback({ tempFilePaths: [url] });
      }
    };
    
    input.click();
  },

  // User Login
  login: (options: { success: (res: { code: string }) => void }) => {
    console.log('[wx.login] Simulating silent login...');
    setTimeout(() => {
      options.success({ code: 'mock_wx_login_code_' + Date.now() });
    }, 500);
  },

  // Payment
  requestPayment: (options: { 
    timeStamp: string, 
    nonceStr: string, 
    package: string, 
    signType: string, 
    paySign: string, 
    success: Function, 
    fail?: Function 
  }) => {
    console.log('[wx.requestPayment] Initiating payment...', options);
    const confirmed = window.confirm(`微信支付\n\n商家：微家教平台\n交易内容：${options.package}\n\n确认支付吗？`);
    
    if (confirmed) {
      setTimeout(() => {
        options.success({ errMsg: 'requestPayment:ok' });
      }, 1000);
    } else {
      if (options.fail) options.fail({ errMsg: 'requestPayment:fail cancel' });
    }
  },

  // UI Feedback
  showToast: (title: string, icon: 'success' | 'none' | 'loading' = 'success') => {
    console.log(`[wx.showToast] ${title} (${icon})`);
  },

  showLoading: (options: { title: string }) => {
    console.log(`[wx.showLoading] ${options.title}`);
    document.body.style.cursor = 'wait';
  },

  hideLoading: () => {
    console.log('[wx.hideLoading]');
    document.body.style.cursor = 'default';
  },

  showModal: (options: { title: string, content: string, success?: (res: { confirm: boolean }) => void }) => {
    const confirm = window.confirm(`${options.title}\n\n${options.content}`);
    if (options.success) {
      options.success({ confirm });
    }
  },

  // Cloud Function Simulation (Bridge to Backend)
  cloud: {
      callFunction: async (name: string, data: any): Promise<any> => {
          console.log(`[wx.cloud] Calling function: ${name}`, data);
          
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  try {
                      switch(name) {
                          case 'getFeePreview':
                              resolve({ result: Backend.calculateWithdrawalFee(data.amount) });
                              break;
                          case 'withdraw':
                              const res = Backend.processWithdrawal(data.amount);
                              if (res.success) resolve({ result: res.wallet });
                              else reject(new Error(res.message));
                              break;
                          case 'debugAddFunds':
                              resolve({ result: Backend.debugAddFunds(data.amount) });
                              break;
                          default:
                              reject(new Error('Function not found'));
                      }
                  } catch (e) {
                      reject(e);
                  }
              }, 600); // Network delay
          });
      }
  },

  // Legacy local accessors (still used for direct read)
  getWallet: (): WalletState => {
     try {
       const val = localStorage.getItem(STORAGE_KEYS.WALLET);
       return val ? JSON.parse(val) : { balance: 0, transactions: [] };
     } catch {
       return { balance: 0, transactions: [] };
     }
  }
};
