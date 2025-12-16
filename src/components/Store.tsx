import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Smartphone, CheckCircle, Zap } from 'lucide-react';

export default function Store() {
  const { user } = useAuth();

  const handleWhatsAppOrder = (amount: number, credits: number) => {
    const message = `Hello Admin, I want to buy ${credits} credits for Rs.${amount}. My User ID is ${user?.id}.`;
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const plans = [
    { credits: 100, price: 49, color: 'bg-blue-500' },
    { credits: 500, price: 199, color: 'bg-purple-500', bestValue: true },
    { credits: 1000, price: 349, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Credit Store 🛒</h1>
        <p className="text-gray-500">Buy credits to unlock premium AI notes and questions.</p>
        <div className="mt-4 inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">
          <Zap className="w-4 h-4 mr-2" />
          Current Balance: {user?.credits} Credits
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.credits} className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow transform hover:-translate-y-1">
            {plan.bestValue && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
                BEST VALUE
              </div>
            )}
            <div className={`${plan.color} p-6 text-white text-center`}>
              <h3 className="text-4xl font-bold">{plan.credits}</h3>
              <p className="text-sm opacity-90">Credits</p>
            </div>
            <div className="p-8 text-center">
              <div className="text-3xl font-bold text-gray-800 mb-6">₹{plan.price}</div>
              <ul className="space-y-3 mb-8 text-left text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Instant Delivery</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Unlock Premium PDF</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Support Developers</li>
              </ul>
              <button
                onClick={() => handleWhatsAppOrder(plan.price, plan.credits)}
                className="w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Order via WhatsApp
              </button>
              <p className="text-xs text-gray-400 mt-3">Directly chats with Admin</p>
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
}
