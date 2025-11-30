
import { WalletState, Transaction, WithdrawalPreview } from '../types';
import { STORAGE_KEYS } from './storage';

/**
 * SIMULATED BACKEND SERVICE
 * In a real app, this logic lives on the server/cloud functions.
 */

// Fee Configuration
export const FEE_RULES = {
  TIER_1: { LIMIT: 1000, RATE: 0.05 }, // 0-1000: 5%
  TIER_2: { LIMIT: 5000, RATE: 0.03 }, // 1000-5000: 3%
  TIER_3: { LIMIT: Infinity, RATE: 0.01 }, // >5000: 1%
  MAX_FEE: 50 // Cap at 50 RMB
};

const getLocalWallet = (): WalletState => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.WALLET);
    return val ? JSON.parse(val) : { balance: 0, transactions: [] };
  } catch {
    return { balance: 0, transactions: [] };
  }
};

const saveLocalWallet = (wallet: WalletState) => {
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
};

export const Backend = {
  /**
   * Calculates the service fee based on tiered rules.
   */
  calculateWithdrawalFee: (amount: number): WithdrawalPreview => {
    let fee = 0;
    let rateApplied = '';

    if (amount <= FEE_RULES.TIER_1.LIMIT) {
      fee = amount * FEE_RULES.TIER_1.RATE;
      rateApplied = '5%';
    } else if (amount <= FEE_RULES.TIER_2.LIMIT) {
      fee = amount * FEE_RULES.TIER_2.RATE;
      rateApplied = '3%';
    } else {
      fee = amount * FEE_RULES.TIER_3.RATE;
      rateApplied = '1%';
    }

    // Apply Cap
    if (fee > FEE_RULES.MAX_FEE) {
      fee = FEE_RULES.MAX_FEE;
      rateApplied = `封顶 ${FEE_RULES.MAX_FEE}元`;
    }

    return {
      amount,
      fee: parseFloat(fee.toFixed(2)),
      netAmount: parseFloat((amount - fee).toFixed(2)),
      rateApplied
    };
  },

  /**
   * Processes a payment (User pays Platform)
   */
  processPayment: (totalAmount: number, title: string): WalletState => {
    const current = getLocalWallet();
    
    const tx: Transaction = {
      id: Date.now().toString(),
      type: 'payment',
      amount: -totalAmount,
      title: title,
      date: new Date().toLocaleString(),
      status: 'success',
      counterparty: '微家教平台托管'
    };

    // For demo purposes, we treat "payment" as just recording the outflow.
    // In a real escrow, this wouldn't immediately deduct if we tracked "balance" strictly as available funds,
    // but here we track user cash flow.
    const newState = {
      balance: parseFloat((current.balance).toFixed(2)), // Balance doesn't change for payer usually, but for this demo let's assume it tracks prepaid balance? 
      // ACTUALLY: Let's assume standard flow: User pays via WeChat Pay (External), so it doesn't affect internal "Balance" unless they topped up first.
      // BUT for Tutors, they receive money.
      // Let's assume this function is called when a Tutor RECEIVES money (Income).
      transactions: [tx, ...current.transactions]
    };
    
    // For OrderConfirm demo, we used updateWallet to deduct. Let's keep it consistent.
    // If a parent pays, it's external money -> Platform.
    saveLocalWallet(newState);
    return newState;
  },

  /**
   * Processes a withdrawal (User cash out)
   */
  processWithdrawal: (amount: number): { success: boolean, wallet?: WalletState, message?: string } => {
    const current = getLocalWallet();
    
    if (current.balance < amount) {
        return { success: false, message: '余额不足' };
    }

    const { fee, netAmount } = Backend.calculateWithdrawalFee(amount);

    const tx: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: -amount,
        title: '余额提现至微信',
        fee: fee,
        date: new Date().toLocaleString(),
        status: 'success',
        counterparty: '微信零钱'
    };

    const newState = {
        balance: parseFloat((current.balance - amount).toFixed(2)),
        transactions: [tx, ...current.transactions]
    };

    saveLocalWallet(newState);
    return { success: true, wallet: newState };
  },
  
  /**
   * Debug helper to add funds
   */
  debugAddFunds: (amount: number): WalletState => {
      const current = getLocalWallet();
      const newState = {
          balance: parseFloat((current.balance + amount).toFixed(2)),
          transactions: [{
              id: Date.now().toString(),
              type: 'income',
              amount: amount,
              title: '系统充值 (测试)',
              date: new Date().toLocaleString(),
              status: 'success'
          } as Transaction, ...current.transactions]
      };
      saveLocalWallet(newState);
      return newState;
  }
};
