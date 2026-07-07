import { Home, Search, Library, Crown, PlusSquare, UploadCloud } from 'lucide-react';
import { ViewState } from '../types';

interface MobileNavProps {
  currentView: string;
  setView: (view: string) => void;
  onNewPlaylist?: () => void;
}

export function MobileNav({ currentView, setView, onNewPlaylist }: MobileNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Your Library' },
    { id: 'premium', icon: Crown, label: 'Premium' },
    { id: 'creator', icon: UploadCloud, label: 'Upload' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = currentView === item.id || (item.id === 'library' && ['liked', 'followed-artists', 'my-ai', 'chill', 'workout', 'focus'].includes(currentView));
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'new-playlist') {
                if (onNewPlaylist) onNewPlaylist();
              } else {
                setView(item.id);
              }
            }}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
