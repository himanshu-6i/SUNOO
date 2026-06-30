import React, { useState } from 'react';
import { User, Lock, Music2, Download, Bell, Palette, Shield, CreditCard, HelpCircle, ChevronRight, Check } from 'lucide-react';

interface SettingsViewProps {
  currentPlan: string;
}

export function SettingsView({ currentPlan }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState('account');
  const [audioQuality, setAudioQuality] = useState('High');
  const [downloadQuality, setDownloadQuality] = useState('High');
  const [theme, setTheme] = useState('Dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggles
  const [toggles, setToggles] = useState({
    twoFactor: false,
    crossfade: true,
    gapless: true,
    normalize: false,
    autoplay: true,
    wifiOnly: true,
    notifFollowers: true,
    notifLikes: true,
    notifPlaylists: false,
    notifReleases: true,
    privateAccount: false,
    hideActivity: false,
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'account', icon: User, label: 'Account' },
    { id: 'playback', icon: Music2, label: 'Music & Playback' },
    { id: 'downloads', icon: Download, label: 'Downloads' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
    { id: 'premium', icon: CreditCard, label: 'Premium' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Settings Navigation */}
      <div className="w-64 border-r border-white/5 bg-black/20 p-6 overflow-y-auto hidden md:block">
        <h2 className="text-2xl font-bold text-white mb-8">Settings</h2>
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32">
        <div className="max-w-3xl">
          
          {/* Account Section */}
          {(activeTab === 'account' || window.innerWidth < 768) && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><User className="w-5 h-5 text-violet-400 md:hidden"/> Account</h3>
              <div className="space-y-4">
                <SettingButton label="Edit Profile" onClick={() => {
                  const newName = prompt('Enter new profile name:');
                  if (newName) showToast(`Profile name updated to ${newName}`);
                }} />
                <SettingButton label="Change Password" onClick={() => {
                  const pass = prompt('Enter new password:');
                  if (pass) showToast('Password updated securely');
                }} />
                <SettingButton label="Change Email" value="h***@gmail.com" onClick={() => {
                  const email = prompt('Enter new email address:');
                  if (email) showToast(`Verification link sent to ${email}`);
                }} />
                <SettingButton label="Phone Verification" value="Unverified" onClick={() => {
                  const phone = prompt('Enter phone number:');
                  if (phone) showToast('Verification code sent via SMS');
                }} />
                <SettingToggle label="Two-Factor Authentication (2FA)" active={toggles.twoFactor} onToggle={() => toggle('twoFactor')} />
              </div>
            </section>
          )}

          {/* Music & Playback Section */}
          {(activeTab === 'playback' || window.innerWidth < 768) && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Music2 className="w-5 h-5 text-violet-400 md:hidden"/> Music & Playback</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-white font-medium mb-3">Audio Quality</p>
                  <div className="flex bg-white/5 rounded-lg p-1">
                    {['Auto', 'Low', 'High', 'Lossless'].map(q => (
                      <button 
                        key={q}
                        onClick={() => setAudioQuality(q)}
                        className={`flex-1 py-2 text-sm font-medium transition-colors rounded-md ${audioQuality === q ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <SettingToggle label="Gapless Playback" active={toggles.gapless} onToggle={() => toggle('gapless')} />
                  <SettingToggle label="Crossfade Tracks" active={toggles.crossfade} onToggle={() => toggle('crossfade')} />
                  <SettingToggle label="Normalize Volume" active={toggles.normalize} onToggle={() => toggle('normalize')} />
                  <SettingToggle label="Autoplay Similar Songs" active={toggles.autoplay} onToggle={() => toggle('autoplay')} />
                </div>
              </div>
            </section>
          )}

          {/* Downloads Section */}
          {(activeTab === 'downloads' || window.innerWidth < 768) && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Download className="w-5 h-5 text-violet-400 md:hidden"/> Downloads</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-white font-medium mb-3">Download Quality</p>
                  <div className="flex gap-2">
                    {['Standard', 'High', 'Lossless'].map(q => (
                      <button 
                        key={q}
                        onClick={() => setDownloadQuality(q)}
                        className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${downloadQuality === q ? 'bg-violet-600 border-violet-600 text-white' : 'border-white/10 text-zinc-400 hover:border-white/30'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <SettingToggle label="Download via Wi-Fi Only" active={toggles.wifiOnly} onToggle={() => toggle('wifiOnly')} />
                  <div className="pt-4">
                    <p className="text-white font-medium mb-2">Storage Management</p>
                    <p className="text-sm text-zinc-400 mb-4">You are using 1.2 GB of storage.</p>
                    <button 
                      onClick={() => {
                        showToast('Storage cache cleared successfully (1.2 GB freed)');
                      }}
                      className="px-6 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium rounded-full transition-colors text-sm"
                    >
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Notifications Section */}
          {(activeTab === 'notifications' || window.innerWidth < 768) && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-violet-400 md:hidden"/> Notifications</h3>
              <div className="space-y-4">
                <SettingToggle label="New Followers" active={toggles.notifFollowers} onToggle={() => toggle('notifFollowers')} />
                <SettingToggle label="Likes & Comments" active={toggles.notifLikes} onToggle={() => toggle('notifLikes')} />
                <SettingToggle label="Playlist Updates" active={toggles.notifPlaylists} onToggle={() => toggle('notifPlaylists')} />
                <SettingToggle label="New Releases from Following" active={toggles.notifReleases} onToggle={() => toggle('notifReleases')} />
              </div>
            </section>
          )}

          {/* Appearance Section */}
          {(activeTab === 'appearance' || window.innerWidth < 768) && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Palette className="w-5 h-5 text-violet-400 md:hidden"/> Appearance</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-white font-medium mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['Dark Mode 🌙', 'Light Mode ☀️', 'System'].map(t => {
                      const baseName = t.split(' ')[0];
                      return (
                        <button 
                          key={t}
                          onClick={() => setTheme(baseName)}
                          className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-all ${theme === baseName ? 'bg-white/10 border-violet-500 text-white' : 'border-white/5 bg-white/5 text-zinc-400 hover:border-white/20'}`}
                        >
                          <span className="text-sm font-medium">{t}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <SettingButton label="App Language" value="English" onClick={() => {
                    const lang = prompt('Enter preferred language (e.g., Spanish, French):');
                    if (lang) showToast(`Language updated to ${lang}`);
                  }} />
                </div>
              </div>
            </section>
          )}

          {/* Privacy Section */}
          {(activeTab === 'privacy' || window.innerWidth < 768) && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-violet-400 md:hidden"/> Privacy</h3>
              <div className="space-y-4">
                <SettingToggle label="Private Account" active={toggles.privateAccount} onToggle={() => toggle('privateAccount')} />
                <SettingToggle label="Hide Listening Activity" active={toggles.hideActivity} onToggle={() => toggle('hideActivity')} />
                <SettingButton label="Block Users" onClick={() => {
                  const user = prompt('Enter username to block:');
                  if (user) showToast(`${user} has been blocked`);
                }} />
                <SettingButton label="Manage Devices" value="2 active" onClick={() => {
                  showToast('Signed out of all other devices');
                }} />
              </div>
            </section>
          )}

          {/* Premium Section */}
          {(activeTab === 'premium' || window.innerWidth < 768) && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-violet-400 md:hidden"/> Premium</h3>
              <div className="bg-gradient-to-br from-violet-600/20 to-blue-600/20 p-6 rounded-2xl border border-white/10 mb-6">
                <p className="text-sm text-zinc-400 mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-white mb-4">{currentPlan}</p>
                {currentPlan === 'Free' && (
                  <button 
                    onClick={() => showToast('Redirecting to checkout for Premium upgrade...')}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <SettingButton label="Subscription Management" onClick={() => showToast('Subscription details page opened')} />
                <SettingButton label="Payment Methods" onClick={() => showToast('Payment methods management opened')} />
                <SettingButton label="Billing History" onClick={() => showToast('Billing history loaded successfully')} />
              </div>
            </section>
          )}

          {/* Support Section */}
          {(activeTab === 'support' || window.innerWidth < 768) && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-violet-400 md:hidden"/> Support</h3>
              <div className="space-y-4">
                <SettingButton label="Help Center" onClick={() => showToast('Opening Help Center in new tab...')} />
                <SettingButton label="Report Copyright Issue" onClick={() => {
                  const issue = prompt('Describe the copyright issue:');
                  if (issue) showToast('Report submitted. We will review it shortly.');
                }} />
                <SettingButton label="Contact Support (poojaloth9216@gmail.com)" onClick={() => {
                  window.location.href = 'mailto:poojaloth9216@gmail.com';
                  showToast('Opening email client...');
                }} />
                <SettingButton label="Terms & Privacy Policy" onClick={() => showToast('Opening legal documents...')} />
              </div>
            </section>
          )}

        </div>
      </div>
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] font-medium animate-in fade-in slide-in-from-bottom-4 z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

function SettingButton({ label, value, onClick }: { label: string, value?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group">
      <span className="text-white font-medium">{label}</span>
      <div className="flex items-center gap-3 text-zinc-400 group-hover:text-white transition-colors">
        {value && <span className="text-sm">{value}</span>}
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}

function SettingToggle({ label, active, onToggle }: { label: string, active: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
      <span className="text-white font-medium">{label}</span>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${active ? 'bg-violet-500' : 'bg-black border border-white/20'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
