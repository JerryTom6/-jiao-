
import React, { useState, useEffect } from 'react';
import { UserRole, ScheduleSlot } from '../types';
import { Sparkles, ChevronRight, Check, AlertCircle, Clock, MapPin, DollarSign, User, X, Camera } from 'lucide-react';
import { optimizeDescription, evaluatePostingQuality } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { wx, STORAGE_KEYS } from '../services/storage';

interface PublishProps {
  userRole: UserRole;
}

const SUBJECTS = ['数学', '英语', '语文', '物理', '钢琴', '编程'];
const GRADES = ['小学1-3年级', '小学4-6年级', '初中', '高中', '大学'];
const GOALS = ['提高成绩', '作业辅导', '竞赛冲刺', '兴趣培养'];
const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const PERIODS = ['上午', '下午', '晚上'];

const Publish: React.FC<PublishProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State
  const [formData, setFormData] = useState({
    subjects: [] as string[],
    gradeLevel: '',
    goals: [] as string[],
    teachingStyle: 'Encouraging',
    priceMin: '',
    priceMax: '',
    location: { address: '', lat: 0, lng: 0 },
    schedule: [] as string[], // Store as simple strings for UI e.g "Sat Morning"
    teacherType: [] as string[],
    description: '',
    genderPref: 'Any',
    attachments: [] as string[], // New: Image URLs
  });

  const [aiResult, setAiResult] = useState<{ score: number; tips: string[] } | null>(null);

  // Storage Effect: Load draft on mount, save draft on change
  useEffect(() => {
    const draft = wx.getStorage(STORAGE_KEYS.DRAFT_POSTING);
    if (draft) {
      setFormData(prev => ({ ...prev, ...draft }));
    }
  }, []);

  useEffect(() => {
    wx.setStorage(STORAGE_KEYS.DRAFT_POSTING, formData);
  }, [formData]);

  // Handlers
  const toggleSubject = (s: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(s) ? prev.subjects.filter(i => i !== s) : [...prev.subjects, s]
    }));
  };

  const toggleGoal = (g: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(g) ? prev.goals.filter(i => i !== g) : [...prev.goals, g]
    }));
  };

  const toggleSchedule = (day: string, period: string) => {
    const key = `${day} ${period}`;
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.includes(key) ? prev.schedule.filter(s => s !== key) : [...prev.schedule, key]
    }));
  };

  const handleImageUpload = () => {
    wx.chooseImage((res) => {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...res.tempFilePaths]
      }));
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleAIReview = async () => {
    const res = await evaluatePostingQuality(formData);
    setAiResult(res);
    
    // Auto generate text if empty
    if (!formData.description) {
        const desc = await optimizeDescription(userRole, formData);
        setFormData(prev => ({ ...prev, description: desc }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        wx.removeStorage(STORAGE_KEYS.DRAFT_POSTING); // Clear draft
        navigate('/'); // Go back home
    }, 1500);
  };

  // --------------------------------------------------------------------------
  // Tutor View (Simplified)
  // --------------------------------------------------------------------------
  if (userRole === 'tutor') {
      return (
          <div className="min-h-full bg-white p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">加入微家教</h1>
              <p className="text-gray-500 text-sm mb-8">创建您的档案，开始接收匹配订单。</p>
              
              <div className="space-y-6">
                  <div>
                      <label className="text-sm font-bold block mb-3">我能教：</label>
                      <div className="flex flex-wrap gap-2">
                          {SUBJECTS.map(s => (
                              <button key={s} onClick={() => toggleSubject(s)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${formData.subjects.includes(s) ? 'bg-wx-green text-white' : 'bg-gray-100 text-gray-600'}`}>
                                  {s}
                              </button>
                          ))}
                      </div>
                  </div>
                  <div>
                      <label className="text-sm font-bold block mb-3">期望时薪 (¥)</label>
                      <input type="number" placeholder="例如：100" className="w-full bg-gray-50 p-3 rounded-lg outline-none focus:ring-1 focus:ring-wx-green"/>
                  </div>
                  <button onClick={() => navigate('/')} className="w-full bg-wx-green text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 mt-10">
                      创建档案
                  </button>
              </div>
          </div>
      );
  }

  // --------------------------------------------------------------------------
  // Parent View (Structured Wizard)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-full bg-gray-50 pb-24">
      {/* Progress Header */}
      <div className="bg-white p-4 sticky top-0 z-30 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-bold text-gray-900">发布需求</h1>
              <span className="text-xs text-wx-green font-medium">第 {step}/3 步</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-wx-green transition-all duration-300" style={{ width: `${step * 33.3}%` }} />
          </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* STEP 1: Core Info */}
        {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
                <section className="bg-white p-5 rounded-xl shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <User size={16} className="mr-2 text-wx-green" /> 学生信息
                    </h3>
                    
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 mb-2 block">科目 (可多选)</label>
                        <div className="flex flex-wrap gap-2">
                            {SUBJECTS.map(s => (
                                <button key={s} onClick={() => toggleSubject(s)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                                      formData.subjects.includes(s) 
                                      ? 'bg-green-50 border-wx-green text-wx-green' 
                                      : 'border-gray-200 text-gray-600'
                                  }`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-gray-500 mb-2 block">年级</label>
                        <select 
                            className="w-full p-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-transparent focus:border-wx-green"
                            value={formData.gradeLevel}
                            onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                        >
                            <option value="">选择年级...</option>
                            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-2 block">主要目标</label>
                        <div className="flex flex-wrap gap-2">
                            {GOALS.map(g => (
                                <button key={g} onClick={() => toggleGoal(g)}
                                  className={`px-3 py-1.5 rounded-full text-xs border ${
                                      formData.goals.includes(g) 
                                      ? 'bg-blue-50 border-blue-500 text-blue-600' 
                                      : 'border-gray-200 text-gray-600'
                                  }`}>
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Media Attachment */}
                <section className="bg-white p-5 rounded-xl shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <Camera size={16} className="mr-2 text-wx-green" /> 学习情况 (试卷/错题)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {formData.attachments.map((url, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
                                <img src={url} className="w-full h-full object-cover" alt="upload" />
                                <button 
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <button 
                          onClick={handleImageUpload}
                          className="w-20 h-20 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400"
                        >
                            <Camera size={24} className="mb-1" />
                            <span className="text-[10px]">添加图片</span>
                        </button>
                    </div>
                </section>
                
                <button 
                    disabled={formData.subjects.length === 0 || !formData.gradeLevel}
                    onClick={() => setStep(2)}
                    className="w-full bg-wx-green text-white py-3.5 rounded-xl font-bold shadow-sm disabled:opacity-50 disabled:shadow-none"
                >
                    下一步：安排
                </button>
            </div>
        )}

        {/* STEP 2: Logistics */}
        {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
                <section className="bg-white p-5 rounded-xl shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                        <MapPin size={16} className="mr-2 text-wx-green" /> 地点与时间
                    </h3>
                    
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 mb-2 block">上课地点 (大概位置)</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="例如：朝阳公园西门附近"
                                className="w-full pl-9 p-3 bg-gray-50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-wx-green"
                                value={formData.location.address}
                                onChange={(e) => setFormData({...formData, location: { ...formData.location, address: e.target.value }})}
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                         <label className="text-xs text-gray-500 mb-2 block">上课时间</label>
                         <div className="overflow-x-auto no-scrollbar pb-2">
                             <div className="grid grid-cols-8 gap-1 min-w-[300px]">
                                 <div className="text-[10px] text-gray-300"></div>
                                 {WEEKDAYS.map(d => <div key={d} className="text-[10px] text-center font-bold text-gray-400">{d}</div>)}
                                 
                                 {PERIODS.map(period => (
                                     <React.Fragment key={period}>
                                         <div className="text-[10px] text-gray-400 flex items-center justify-center">{period}</div>
                                         {WEEKDAYS.map(day => {
                                             const isActive = formData.schedule.includes(`${day} ${period}`);
                                             return (
                                                 <div 
                                                    key={`${day}-${period}`}
                                                    onClick={() => toggleSchedule(day, period)}
                                                    className={`h-8 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                                                        isActive ? 'bg-wx-green border-wx-green text-white' : 'border-gray-100 bg-gray-50'
                                                    }`}
                                                 >
                                                     {isActive && <Check size={12} />}
                                                 </div>
                                             );
                                         })}
                                     </React.Fragment>
                                 ))}
                             </div>
                         </div>
                    </div>
                </section>

                <section className="bg-white p-5 rounded-xl shadow-sm">
                     <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <DollarSign size={16} className="mr-2 text-wx-green" /> 预算 (时薪)
                    </h3>
                    <div className="flex items-center space-x-3">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">¥</span>
                            <input type="number" placeholder="最低" className="w-full pl-7 p-2.5 bg-gray-50 rounded-lg text-sm outline-none" 
                                value={formData.priceMin} onChange={e => setFormData({...formData, priceMin: e.target.value})} />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">¥</span>
                            <input type="number" placeholder="最高" className="w-full pl-7 p-2.5 bg-gray-50 rounded-lg text-sm outline-none"
                                value={formData.priceMax} onChange={e => setFormData({...formData, priceMax: e.target.value})} />
                        </div>
                    </div>
                </section>

                <div className="flex space-x-3">
                    <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl font-bold text-gray-500 bg-white shadow-sm border border-gray-100">上一步</button>
                    <button onClick={() => { setStep(3); handleAIReview(); }} className="flex-1 bg-wx-green text-white py-3.5 rounded-xl font-bold shadow-sm">下一步：预览</button>
                </div>
            </div>
        )}

        {/* STEP 3: Review & Publish */}
        {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
                 {/* AI Quality Score Card */}
                 <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white relative overflow-hidden shadow-lg">
                     <div className="relative z-10">
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                 <h3 className="text-sm font-bold text-gray-200">需求完整度评分</h3>
                                 <p className="text-[10px] text-gray-400 mt-1">高分需求应征率提升 80%。</p>
                             </div>
                             <div className="text-3xl font-bold text-wx-green">
                                 {aiResult ? aiResult.score : '--'}
                             </div>
                         </div>
                         
                         {aiResult && aiResult.tips.length > 0 && (
                             <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 space-y-2">
                                 {aiResult.tips.map((tip, i) => (
                                     <div key={i} className="flex items-start text-xs text-gray-300">
                                         <AlertCircle size={12} className="mr-2 mt-0.5 text-orange-400 flex-shrink-0" />
                                         {tip}
                                     </div>
                                 ))}
                             </div>
                         )}
                     </div>
                     <Sparkles className="absolute -bottom-4 -right-4 text-white opacity-5" size={120} />
                 </div>

                 <div className="bg-white p-4 rounded-xl shadow-sm">
                     <label className="text-sm font-bold text-gray-800 mb-2 block">需求描述预览</label>
                     <textarea 
                        className="w-full h-32 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-wx-green resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="AI 正在生成描述..."
                     />
                 </div>

                 <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                     <span>着急找老师？</span>
                     <div className="flex items-center space-x-2">
                         <label className="flex items-center space-x-1">
                             <input type="checkbox" className="rounded text-wx-green focus:ring-0" />
                             <span>加急 (+¥5)</span>
                         </label>
                     </div>
                 </div>

                 <div className="flex space-x-3">
                    <button onClick={() => setStep(2)} className="px-6 py-3.5 rounded-xl font-bold text-gray-500 bg-white shadow-sm border border-gray-100">上一步</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        className="flex-1 bg-wx-green text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 flex justify-center items-center"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            '立即发布'
                        )}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Publish;
