
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Image as ImageIcon, Mic, Smile, PlusCircle, MapPin, Home } from 'lucide-react';
import { MOCK_CHATS, MOCK_MESSAGES, TUTOR_QUICK_REPLIES } from '../data';
import { Message, UserRole } from '../types';
import { wx } from '../services/storage';

interface ChatDetailProps {
  userRole: UserRole; // To determine if we show quick replies
}

const ChatDetail: React.FC<ChatDetailProps> = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatInfo = MOCK_CHATS.find(c => c.id === id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && MOCK_MESSAGES[id]) {
      setMessages(MOCK_MESSAGES[id]);
    } else {
        // Init empty or default
        setMessages([]);
    }
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      
      // Mock reply if needed (simple echo logic for demo)
      if (msg.senderId === 'me' && messages.length > 0) {
        setTimeout(() => {
             const reply: Message = {
                id: (Date.now() + 1).toString(),
                senderId: 'other',
                text: '收到。',
                timestamp: Date.now(),
                type: 'text'
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    
    const newMsg: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        text: inputText,
        timestamp: Date.now(),
        type: 'text'
    };
    
    addMessage(newMsg);
    setInputText('');
  };

  const handleSendImage = () => {
    wx.chooseImage((res) => {
        const newMsg: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            imageUrl: res.tempFilePaths[0],
            timestamp: Date.now(),
            type: 'image'
        };
        addMessage(newMsg);
        setShowPanel(false);
    });
  };

  if (!chatInfo && id !== 'system') return <div>Chat not found</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4 h-12 pt-safe-top sticky top-0 z-50">
        <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 -ml-2">
            <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="text-base font-bold text-gray-900 ml-1">
                {chatInfo?.name || '用户'}
            </h1>
        </div>
        <button onClick={() => navigate('/')} className="p-1">
          <Home size={20} className="text-gray-900" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" onClick={() => setShowPanel(false)}>
        {messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                        <img src={chatInfo?.avatar} className="w-9 h-9 rounded-lg mr-2 bg-gray-300" alt="" />
                    )}
                    
                    {msg.type === 'image' ? (
                        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm max-w-[60%]">
                            <img src={msg.imageUrl} alt="chat" className="w-full h-auto" />
                        </div>
                    ) : (
                        <div className={`max-w-[70%] p-3 rounded-lg text-sm leading-relaxed relative ${
                            isMe 
                            ? 'bg-wx-green text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    )}

                    {isMe && (
                         <img src="https://picsum.photos/100/100?random=50" className="w-9 h-9 rounded-lg ml-2 bg-gray-300" alt="" />
                    )}
                </div>
            );
        })}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-50 border-t border-gray-200 pb-safe">
          {/* Quick Replies (Tutor Only) */}
          {userRole === 'tutor' && !showPanel && (
              <div className="flex gap-2 p-2 overflow-x-auto no-scrollbar bg-white border-b border-gray-100">
                  {TUTOR_QUICK_REPLIES.map((reply, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                            const msg: Message = { id: Date.now().toString(), senderId: 'me', text: reply.text, timestamp: Date.now(), type: 'text' };
                            addMessage(msg);
                        }}
                        className="flex-shrink-0 bg-green-50 text-wx-green border border-green-100 text-xs px-3 py-1.5 rounded-full whitespace-nowrap active:bg-green-100"
                      >
                          {reply.label}
                      </button>
                  ))}
              </div>
          )}

          <div className="p-2 flex items-end space-x-2 bg-gray-100">
              <button className="p-2 text-gray-600">
                  <Mic size={24} />
              </button>
              <div className="flex-1 bg-white rounded-lg min-h-[40px] flex items-center px-2 py-1">
                  <input 
                    type="text" 
                    className="w-full bg-transparent outline-none text-base max-h-24"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                    onFocus={() => setShowPanel(false)}
                  />
              </div>
              <button className="p-2 text-gray-600">
                  <Smile size={24} />
              </button>
               {inputText.trim() ? (
                   <button 
                    onClick={handleSendText}
                    className="mb-1.5 px-3 py-1.5 bg-wx-green text-white text-sm rounded-md font-medium"
                   >
                       发送
                   </button>
               ) : (
                   <button 
                    onClick={() => setShowPanel(!showPanel)} 
                    className={`p-2 transition-transform duration-200 ${showPanel ? 'rotate-45 text-gray-800' : 'text-gray-600'}`}
                   >
                       <PlusCircle size={24} />
                   </button>
               )}
          </div>

          {/* Plus Panel */}
          {showPanel && (
              <div className="h-48 bg-gray-100 border-t border-gray-200 p-6">
                  <div className="grid grid-cols-4 gap-6">
                      <button onClick={handleSendImage} className="flex flex-col items-center space-y-2">
                          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-600">
                              <ImageIcon size={28} />
                          </div>
                          <span className="text-xs text-gray-500">照片</span>
                      </button>
                      <button className="flex flex-col items-center space-y-2 opacity-50">
                           <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-600">
                              <MapPin size={28} />
                          </div>
                          <span className="text-xs text-gray-500">位置</span>
                      </button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default ChatDetail;
