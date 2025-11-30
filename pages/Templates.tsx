
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Plus, Trash2, MessageSquareText } from 'lucide-react';
import { TUTOR_QUICK_REPLIES } from '../data';
import { wx } from '../services/storage';

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(TUTOR_QUICK_REPLIES);

  const handleDelete = (index: number) => {
    wx.showModal({
        title: '删除模板',
        content: '确定要删除这条快捷回复吗？',
        success: (res) => {
            if (res.confirm) {
                const newTemplates = [...templates];
                newTemplates.splice(index, 1);
                setTemplates(newTemplates);
                wx.showToast('已删除', 'success');
            }
        }
    });
  };

  const handleAdd = () => {
      // Mock adding logic
      const newTemplate = {
          label: '新回复',
          text: '您好，我可以提供免费试听课...'
      };
      setTemplates([...templates, newTemplate]);
      wx.showToast('已添加默认模板', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white px-4 h-12 flex items-center justify-between border-b border-gray-100 pt-safe-top sticky top-0 z-50">
         <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="-ml-2 p-2">
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="font-bold text-base text-gray-900 ml-2">应征话术模板</h1>
         </div>
         <button onClick={() => navigate('/')} className="p-2">
             <Home size={20} className="text-gray-800" />
         </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-xs mb-4 flex items-start">
            <MessageSquareText size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            设置常用的打招呼话术，在应征或聊天时可一键发送，提升接单效率。
        </div>

        {templates.map((tpl, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-wx-green bg-green-50 px-2 py-0.5 rounded">{tpl.label}</span>
                    <button onClick={() => handleDelete(idx)} className="text-gray-400 p-1">
                        <Trash2 size={16} />
                    </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {tpl.text}
                </p>
            </div>
        ))}
      </div>

      <div className="p-4 pb-safe bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0">
          <button onClick={handleAdd} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl flex items-center justify-center">
              <Plus size={18} className="mr-2" />
              新建模板
          </button>
      </div>
    </div>
  );
};

export default Templates;
