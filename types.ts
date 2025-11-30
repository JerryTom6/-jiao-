
export type UserRole = 'parent' | 'tutor';

export interface Location {
  name: string;
  address?: string; // Fuzzy address (e.g. "Sunshine Garden, Haidian")
  lat: number;
  lng: number;
}

export interface City {
  name: string;
  id: string;
}

export interface CityGroup {
  letter: string;
  list: City[];
}

export interface ScheduleSlot {
  day: '周一' | '周二' | '周三' | '周四' | '周五' | '周六' | '周日';
  periods: ('上午' | '下午' | '晚上')[];
}

export interface ApplicationTemplate {
  id: string;
  title: string;
  content: string;
}

export interface Listing {
  id: string;
  type: 'job_request' | 'tutor_profile'; 
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  description: string; // The "moment" style text
  
  // Core Structured Data
  subjects: string[]; // Math, English, Piano
  gradeLevel: string; // Grade 3, Grade 10
  goals: string[]; // Improve Grades, Exams
  
  // Logistics
  priceMin?: number;
  priceMax?: number; // Hourly rate range
  location: Location;
  schedule: ScheduleSlot[];
  
  // Preferences / Tags
  teacherType?: ('Student' | 'Professional' | 'Agency')[];
  teachingStyle?: ('Strict' | 'Encouraging' | 'Fun')[];
  genderPref?: 'Male' | 'Female' | 'Any';
  
  // Attachments (New)
  attachments?: string[];

  // Meta
  timestamp: string;
  verified?: boolean;
  distance?: number; // Calculated at runtime (km)
  matchScore?: number; // Runtime calculated
  
  // Stats
  viewCount?: number;
  applicantCount?: number;
}

export interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  type: 'system' | 'user';
  tags?: string[];
}

export interface Message {
  id: string;
  senderId: string; // 'me' or 'other'
  text?: string;
  imageUrl?: string; // Support for image messages
  timestamp: number;
  type: 'text' | 'image' | 'system';
}

export interface QuickReply {
  label: string;
  text: string;
}

// Payment & Orders
export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number; // Tuition
  serviceFee: number; // Platform fee
  total: number;
  status: 'pending' | 'paid' | 'completed' | 'refunded';
  timestamp: number;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'income' | 'withdrawal' | 'refund';
  amount: number; // Positive for income, negative for payment/withdrawal
  title: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  fee?: number; // Service fee deducted
  counterparty?: string; // Who was the money sent to/from
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
}

export interface WithdrawalPreview {
  amount: number;
  fee: number;
  netAmount: number;
  rateApplied: string;
}
