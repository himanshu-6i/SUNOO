import React, { useState } from 'react';
import { Check, Sparkles, Music, Star, GraduationCap, X } from 'lucide-react';

interface PremiumViewProps {
  currentPlan: string;
  onSubscribe: (planName: string) => void;
}

export function PremiumView({ currentPlan, onSubscribe }: PremiumViewProps) {
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleSubscribe = (planName: string) => {
    onSubscribe(planName);
    setShowToast(planName);
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  const plans = [
    {
      id: 'mini',
      name: 'SUNOO Mini',
      price: '₹49',
      duration: '/month',
      icon: Music,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Ad-free listening',
        'Better audio quality',
        'Unlimited skips',
        'Background play',
      ]
    },
    {
      id: 'premium',
      name: 'SUNOO Premium',
      price: '₹89',
      duration: '/month',
      icon: Star,
      popular: true,
      color: 'from-violet-500 to-fuchsia-500',
      features: [
        'Mini ke sab features',
        'Offline downloads',
        'Highest audio quality',
        'Exclusive playlists',
        'Early access to new features',
      ]
    },
    {
      id: 'student',
      name: 'Student Offer',
      price: '₹29',
      duration: '/month',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-500',
      features: [
        'College students ke liye',
        'Verification ke baad',
        'Premium ke sab features',
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-32 p-8 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 mt-8">
          <div className="inline-flex items-center gap-2 text-violet-400 font-medium text-sm mb-4 bg-violet-500/10 px-4 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>Go Premium</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tighter text-white mb-6">
            Pick your perfect plan
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Listen without limits on your phone, speaker, and other devices. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white/5 backdrop-blur-xl border ${plan.popular ? 'border-violet-500' : 'border-white/10'} p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-2xl`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 bg-violet-500 text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className={`absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br ${plan.color} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="mb-8 mt-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg mb-6`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold tracking-tighter text-white">{plan.price}</span>
                  <span className="text-zinc-400 font-medium">{plan.duration}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex gap-3 text-zinc-300">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe(plan.name)}
                disabled={currentPlan === plan.name}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] ${
                  currentPlan === plan.name
                    ? 'bg-white/10 text-white cursor-not-allowed border border-white/20'
                    : plan.popular 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                      : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {currentPlan === plan.name ? 'Current Plan' : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-violet-200" />
          <div>
            <p className="font-bold">Welcome to {showToast}!</p>
            <p className="text-sm text-violet-200">Your premium features are now unlocked.</p>
          </div>
          <button onClick={() => setShowToast(null)} className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
