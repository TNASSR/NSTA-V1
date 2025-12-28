import React from 'react';
import { User } from '../types';
import { Smartphone, CheckCircle, Zap } from 'lucide-react';

interface Props {
    user: User;
}

export const Store: React.FC<Props> = ({ user }) => {

  const handleWhatsAppOrder = (amount: number, credits: number) => {
    const message = `Hello Admin, I want to buy ${credits} credits for Rs.${amount}. My User ID is ${user?.id}.`;
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const plans = [
    {
        id: 'basic',
        name: 'Basic Plan',
        credits: 100,
        price: 49,
        isUltra: false,
        features: ['Instant Credits', 'Unlock PDF Notes', 'Standard Support']
    },
    {
        id: 'ultra',
        name: 'Ultra Plan (VIP)',
        credits: 500,
        price: 199,
        isUltra: true,
        features: ['5x More Credits', 'Priority Admin Chat', 'Unlock Premium AI', 'Gold Badge Profile']
    },
    {
        id: 'pro',
        name: 'Pro Pack',
        credits: 1000,
        price: 349,
        isUltra: false,
        features: ['Maximum Value', 'Bulk Credits', 'For Power Users']
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Premium Store</h1>
        <p className="text-slate-500">Upgrade your learning with Premium Credits.</p>
        <div className="mt-4 inline-flex items-center bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-full font-bold">
          <Zap className="w-4 h-4 mr-2 fill-yellow-500 text-yellow-500" />
          Balance: {user?.credits} Credits
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 ${
                plan.isUltra
                ? 'bg-slate-900 text-white border-2 border-yellow-500 shadow-2xl shadow-yellow-500/20'
                : 'bg-white text-slate-800 border-2 border-cyan-200 shadow-lg'
            }`}
          >
            {/* SHINE ANIMATION FOR ULTRA */}
            {plan.isUltra && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                </div>
            )}

            {plan.isUltra && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-wider z-10">
                RECOMMENDED
              </div>
            )}

            <div className="p-8 text-center relative z-10">
              <h3 className={`text-lg font-bold uppercase tracking-widest mb-1 ${plan.isUltra ? 'text-yellow-400' : 'text-cyan-600'}`}>
                  {plan.name}
              </h3>
              <div className="text-5xl font-black mb-2 flex items-center justify-center gap-1">
                  <span className="text-2xl opacity-50">₹</span>{plan.price}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 ${plan.isUltra ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {plan.credits} Credits
              </div>

              <ul className="space-y-3 mb-8 text-left text-sm opacity-90">
                {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${plan.isUltra ? 'text-yellow-400' : 'text-cyan-500'}`} />
                        {feat}
                    </li>
                ))}
              </ul>

              <button
                onClick={() => handleWhatsAppOrder(plan.price, plan.credits)}
                className={`w-full flex items-center justify-center py-4 rounded-xl font-bold transition-all active:scale-95 ${
                    plan.isUltra
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-orange-500/40'
                    : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-200'
                }`}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Buy Now
              </button>
              <p className={`text-[10px] mt-4 opacity-50`}>Secure payment via WhatsApp</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
        <h3 className="font-bold text-gray-700 mb-2">Have a Gift Code?</h3>
        <div className="flex max-w-md mx-auto space-x-2">
          <input 
            type="text" 
            placeholder="Enter Code (e.g. FREE2024)" 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900">
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
};
