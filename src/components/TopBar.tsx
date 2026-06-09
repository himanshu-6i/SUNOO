import { Search as SearchIcon, Bell, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { currentUser as mockUser } from '../data';
import { Notification } from '../types';
import { auth } from '../firebase';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
  onNavigate: (view: 'profile' | 'settings') => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export function TopBar({ searchQuery, onSearchChange, notifications, onMarkNotificationRead, onLogout, onNavigate, onBack, onForward, canGoBack, canGoForward }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-16 flex items-center justify-between px-8 bg-black/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          disabled={!canGoBack}
          className={`w-8 h-8 rounded-full bg-black flex items-center justify-center transition-colors ${canGoBack ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={onForward}
          disabled={!canGoForward}
          className={`w-8 h-8 rounded-full bg-black flex items-center justify-center transition-colors ${canGoForward ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
           <SearchIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => onSearchChange(e.target.value)}
             placeholder="What do you want to play?" 
             className="w-80 bg-white/10 text-white placeholder-zinc-500 text-sm rounded-full pl-10 pr-4 py-2.5 outline-none focus:bg-white/20 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
           />
        </div>
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-zinc-400 hover:text-white transition-colors relative mt-1"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full border-2 border-black flex items-center justify-center pointer-events-none">
              </div>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 bg-[#1e1e24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-zinc-300">{unreadCount} unread</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        notifications.forEach(n => !n.read && onMarkNotificationRead(n.id));
                      }}
                       className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> All Read
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">No new notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-white/5 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors ${!notif.read ? 'bg-violet-500/5' : ''}`}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-violet-500 flex-shrink-0" style={{ opacity: notif.read ? 0 : 1 }} />
                      <div className="flex-1">
                        <p className={`text-sm tracking-tight ${!notif.read ? 'text-white font-semibold' : 'text-zinc-300'}`}>{notif.title}</p>
                        <p className="text-xs text-zinc-400 mt-1">{notif.message}</p>
                        <p className="text-[10px] text-zinc-500 mt-2 font-mono">{notif.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-white/10 overflow-hidden border border-white/10 hover:border-white/30 transition-colors focus:outline-none"
          >
            <img src={auth.currentUser?.photoURL || mockUser.avatarUrl} alt={auth.currentUser?.displayName || mockUser.name} className="w-full h-full object-cover" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-4 w-48 bg-[#1e1e24] border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
               <div className="px-4 py-2 border-b border-white/5">
                 <p className="text-sm font-semibold text-white truncate">{auth.currentUser?.displayName || mockUser.name}</p>
                 <p className="text-xs text-zinc-500 capitalize">{mockUser.role} Account</p>
               </div>
               <button onClick={() => onNavigate('profile')} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Profile</button>
               <button onClick={() => onNavigate('settings')} className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Settings</button>
               <div className="border-t border-white/5 mt-1 pt-1">
                 <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
                 >
                   Log Out
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
