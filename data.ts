import { Listing, ChatPreview, Message, QuickReply } from './types';

export const CURRENT_USER_LOC = { lat: 39.9042, lng: 116.4074 };

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    type: 'job_request',
    authorId: 'p1',
    authorName: '张女士',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    title: '小学三年级数学 - 考前突击',
    description: '急需一位有耐心的老师，帮孩子复习乘除法，希望能每周固定上课。孩子比较抗拒枯燥的刷题，希望老师能有互动性强的教学方法。需自带部分教辅资料。',
    subjects: ['数学'],
    gradeLevel: '小学3年级',
    goals: ['考级冲刺', '补差提分'],
    priceMin: 80,
    priceMax: 120,
    location: { name: '海淀区·中关村', address: '中关村B座', lat: 39.98, lng: 116.32 },
    schedule: [{ day: '周六', periods: ['上午'] }, { day: '周三', periods: ['晚上'] }],
    teacherType: ['Student'],
    teachingStyle: ['Encouraging'],
    timestamp: '10分钟前',
    verified: true,
    applicantCount: 2,
    viewCount: 45,
  },
  {
    id: '2',
    type: 'job_request',
    authorId: 'p2',
    authorName: '李先生',
    authorAvatar: 'https://picsum.photos/100/100?random=5',
    title: '钢琴陪练 (5级)',
    description: '找一位钢琴陪练，女儿正在准备5级考试，需要纠正手型。家里有钢琴，希望能上门。',
    subjects: ['钢琴'],
    gradeLevel: '5级',
    goals: ['兴趣培养', '考级冲刺'],
    priceMin: 150,
    priceMax: 200,
    location: { name: '朝阳公园西门', address: '朝阳公园西门', lat: 39.93, lng: 116.46 },
    schedule: [{ day: '周日', periods: ['下午'] }],
    teacherType: ['Professional'],
    timestamp: '1小时前',
    verified: true,
    applicantCount: 5,
    viewCount: 120,
  },
  {
    id: '3',
    type: 'job_request',
    authorId: 'p3',
    authorName: '王女士',
    authorAvatar: 'https://picsum.photos/100/100?random=8',
    title: '高中物理补习',
    description: '物理力学部分比较吃力，需要老师讲解清晰，最好是理科专业的大学生。',
    subjects: ['物理'],
    gradeLevel: '高一',
    goals: ['提高成绩'],
    priceMin: 100,
    priceMax: 150,
    location: { name: '东城区·王府井', address: '王府井附近', lat: 39.91, lng: 116.41 },
    schedule: [{ day: '周三', periods: ['晚上'] }],
    timestamp: '2小时前',
    applicantCount: 0,
    viewCount: 12,
  },
  {
    id: '4',
    type: 'tutor_profile',
    authorId: 't1',
    authorName: '陈大卫',
    authorAvatar: 'https://picsum.photos/100/100?random=12',
    title: '清华数学系 - 奥数金牌教练',
    description: '清华大学数学系在读，曾获奥数金牌。擅长引导式教学，让孩子爱上数学。已有3年家教经验，带过10+学生。',
    subjects: ['数学', '奥数'],
    gradeLevel: '全龄段',
    goals: ['竞赛'],
    priceMin: 200,
    location: { name: '海淀区', lat: 39.99, lng: 116.33 },
    schedule: [{ day: '周六', periods: ['上午', '下午'] }, { day: '周日', periods: ['上午', '下午'] }],
    teacherType: ['Student'],
    teachingStyle: ['Fun', 'Strict'],
    timestamp: '刚刚活跃',
    verified: true,
    viewCount: 300,
  }
];

export const MOCK_CHATS: ChatPreview[] = [
  {
    id: 'system',
    name: '需求匹配助手',
    avatar: 'SYSTEM',
    lastMessage: '3 位老师匹配了您的“三年级数学”需求！',
    time: '10:05',
    unreadCount: 3,
    type: 'system',
    tags: ['Match']
  },
  {
    id: '1',
    name: '张女士',
    avatar: 'https://picsum.photos/100/100?random=1',
    lastMessage: '试听课定在下午5点可以吗？',
    time: '14:20',
    unreadCount: 0,
    type: 'user'
  },
  {
    id: '2',
    name: '陈大卫',
    avatar: 'https://picsum.photos/100/100?random=12',
    lastMessage: '我已经发送了简历，请查收。',
    time: '昨天',
    unreadCount: 0,
    type: 'user'
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: 'other', text: '您好，我对您的数学家教需求很感兴趣。', timestamp: 1625232000000, type: 'text' },
    { id: 'm2', senderId: 'me', text: '您好，请问您是大学生还是在职老师？', timestamp: 1625232060000, type: 'text' },
    { id: 'm3', senderId: 'other', text: '我是北大数学系大三学生，有过两年经验。', timestamp: 1625232120000, type: 'text' },
    { id: 'm4', senderId: 'other', text: '试听课定在下午5点可以吗？', timestamp: 1625232180000, type: 'text' },
  ],
  '2': [
    { id: 'm1', senderId: 'me', text: '陈老师您好，想咨询一下奥数课。', timestamp: 1625232000000, type: 'text' },
    { id: 'm2', senderId: 'other', text: '您好！我是陈大卫，清华数学系在读。请问孩子几年级？', timestamp: 1625232060000, type: 'text' },
    { id: 'm3', senderId: 'other', text: '我已经发送了简历，请查收。', timestamp: 1625232060000, type: 'text' },
  ]
};

export const TUTOR_QUICK_REPLIES: QuickReply[] = [
  { label: '自我介绍', text: '家长您好！我是XX大学XX专业在读生，有2年家教经验，擅长引导式教学，距离您家很近，希望能有机会试讲。' },
  { label: '询问学情', text: '您好，想进一步了解一下孩子目前的基础情况，方便简单说一下吗？' },
  { label: '预约试听', text: '我们可以约这周末进行一次试听课，看看孩子是否适应我的教学风格。' },
];