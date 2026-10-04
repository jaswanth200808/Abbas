import React, { useMemo, useState } from 'react';
import { 
  Send, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Message } from '../types';

export const MessagesPage: React.FC = () => {
  const { currentUser, allUsers, messages, sendMessage } = useApp();

  // Find all conversation partner IDs for currentUser
  const conversations = useMemo(() => {
    const map = new Map<string, { partnerId: string; lastMessage: Message; unreadCount: number }>();
    messages.forEach(msg => {
      const isSender = msg.senderId === currentUser.id;
      const isRecipient = msg.recipientId === currentUser.id;
      if (!isSender && !isRecipient) return;

      const partnerId = isSender ? msg.recipientId : msg.senderId;
      if (!map.has(partnerId)) {
        map.set(partnerId, {
          partnerId,
          lastMessage: msg,
          unreadCount: 0
        });
      } else {
        const current = map.get(partnerId)!;
        map.set(partnerId, {
          ...current,
          lastMessage: msg
        });
      }
    });

    return Array.from(map.values()).map(entry => {
      const partner = allUsers.find(u => u.id === entry.partnerId) || {
        id: entry.partnerId,
        name: 'Campus Student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        department: 'Engineering Student',
        trustScore: 90
      };
      return {
        ...entry,
        partner
      };
    });
  }, [messages, currentUser, allUsers]);

  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    if (conversations.length > 0) return conversations[0].partnerId;
    return 'user_rahul';
  });

  const [inputText, setInputText] = useState('');

  const activePartner = allUsers.find(u => u.id === activePartnerId) || {
    id: activePartnerId,
    name: 'Student Partner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    department: 'Engineering Student',
    trustScore: 92,
    campus: 'Main Campus'
  };

  // Filter messages for active conversation
  const activeConversationMessages = messages.filter(
    m => (m.senderId === currentUser.id && m.recipientId === activePartnerId) || 
         (m.senderId === activePartnerId && m.recipientId === currentUser.id)
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(
      activePartnerId,
      activePartner.name,
      inputText.trim()
    );
    setInputText('');
  };

  const quickChips = [
    'Hi! Is this available for today?',
    'Can we meet at Hostel Block A gate?',
    'I’m at the Library entrance table!',
    'Returned safely, thanks a lot!'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div>
        <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
          Direct Campus Handover Chat
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
          Messages & Handover Coordination
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Coordinate meeting spots, verify item condition, and confirm returns directly with your peers.
        </p>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[580px]">
        
        {/* Left: Conversations list */}
        <div className="border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Conversations ({conversations.length})
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active conversations yet. Start a chat from any item's "Contact Owner" button!
              </div>
            ) : (
              conversations.map(({ partner, lastMessage }) => {
                const isActive = partner.id === activePartnerId;
                return (
                  <button
                    key={partner.id}
                    onClick={() => setActivePartnerId(partner.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      isActive ? 'bg-indigo-50/80 border-r-4 border-indigo-600' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <img 
                      src={partner.avatar} 
                      alt={partner.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate flex items-center gap-1">
                          {partner.name}
                          <ShieldCheck className="w-3 h-3 text-indigo-600 shrink-0" />
                        </span>
                        <span className="text-[10px] text-slate-400">{lastMessage.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lastMessage.text}
                      </p>
                      <div className="text-[10px] text-indigo-700 font-semibold mt-1">
                        Trust: {partner.trustScore}/100
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Quick student contact directory */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Start Chat with Campus Peer:
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allUsers.filter(u => u.id !== currentUser.id).map(u => (
                <button
                  key={u.id}
                  onClick={() => setActivePartnerId(u.id)}
                  className={`text-xs px-2 py-1 rounded-lg border font-medium flex items-center gap-1.5 shrink-0 ${
                    u.id === activePartnerId 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{u.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="md:col-span-2 flex flex-col justify-between bg-white h-[580px]">
          
          {/* Partner header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <img 
                src={activePartner.avatar} 
                alt={activePartner.name} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200" 
              />
              <div>
                <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>{activePartner.name}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{activePartner.department}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">{activePartner.trustScore}/100 Trust</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">
              Campus Handover Channel
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Handover Trust Tip banner */}
            <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Safety Tip: Handover items in well-lit public campus spots like Hostel lobbies, department offices, or the central library.
              </span>
            </div>

            {activeConversationMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No prior messages with {activePartner.name}. Send a message to coordinate handover!
              </div>
            ) : (
              activeConversationMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isMe && (
                        <img 
                          src={msg.senderAvatar} 
                          alt={msg.senderName} 
                          className="w-6 h-6 rounded-full object-cover mb-1" 
                        />
                      )}
                      
                      <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs shadow-xs' 
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}>
                        {msg.itemTitle && (
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 px-1.5 py-0.5 rounded ${
                            isMe ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            📦 {msg.itemTitle}
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Suggestions & Input */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
            {/* Quick chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <span className="text-slate-400 font-bold shrink-0">Quick:</span>
              {quickChips.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(chip)}
                  className="bg-white hover:bg-indigo-50 hover:text-indigo-700 px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 font-medium whitespace-nowrap transition-colors shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activePartner.name}...`}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
