import React from 'react';
import { Sparkles } from 'lucide-react';

export function UpdatingSoonView() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] text-center p-8 bg-[#050505]">
      <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl shadow-violet-500/10">
         <Sparkles className="w-12 h-12 text-violet-500" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Updating Soon</h1>
      <p className="text-zinc-400 max-w-md text-lg">
        We're working hard to bring you these awesome new AI features. Stay tuned for the upcoming release!
      </p>
    </div>
  );
}
