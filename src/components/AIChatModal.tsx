import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface AIChatModalProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thoughts?: string;
}

export function AIChatModal({ onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hi! I am the Sunoo AI Assistant. Ask me anything about our app's music, artists, genres, or AI music generation! (Please note I can only answer questions related to the Sunoo app)." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/thinking-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.output,
        thoughts: data.thoughts
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I ran into an error processing that request."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="bg-[#121215] border border-white/10 rounded-2xl w-full max-w-md h-full flex flex-col shadow-2xl relative"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#18181b] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Sunoo AI</h2>
              <p className="text-[10px] text-zinc-400">Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-transparent'}`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-zinc-400" /> : <Bot className="w-5 h-5 text-violet-400" />}
              </div>
              <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.thoughts && (
                  <div className="bg-zinc-900 border border-white/5 text-zinc-500 text-[11px] p-2 rounded-lg italic max-h-32 overflow-hidden hover:overflow-y-auto mb-1 w-full text-left font-mono leading-tight">
                    <span className="font-bold block mb-1">Thinking Process:</span>
                    {msg.thoughts}
                  </div>
                )}
                <div className={`px-4 py-2.5 rounded-2xl text-[14px] ${msg.role === 'user' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-sm' : 'bg-[#18181b] border border-white/5 text-zinc-300 rounded-tl-sm'}`}>
                   {msg.role === 'user' ? msg.content : (
                     <div className="markdown-body prose prose-invert prose-sm max-w-none">
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                 <Bot className="w-5 h-5 text-violet-400" />
              </div>
              <div className="px-4 py-3 bg-[#18181b] border border-white/5 rounded-2xl rounded-tl-sm text-zinc-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Gathering response...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-[#18181b] flex items-center gap-2 rounded-b-2xl">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI anything..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-violet-500/50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
