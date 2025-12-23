import React, { useState } from 'react';
import { Gift, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { User, GiftCode } from '../types';
import { rtdb, saveUserToLive } from '../firebase';
import { ref, get, child, update, set } from "firebase/database";

interface Props {
  user: User;
  onSuccess: (updatedUser: User) => void;
}

export const RedeemSection: React.FC<Props> = ({ user, onSuccess }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [msg, setMsg] = useState('');

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setStatus('LOADING');
    
    try {
        const codeRef = ref(rtdb, 'redeem_codes/' + code.trim());
        const snapshot = await get(codeRef);

        if (!snapshot.exists()) {
            setStatus('ERROR');
            setMsg('Invalid Code. Please check and try again.');
            return;
        }

        const targetCode = snapshot.val();

        if (targetCode.isRedeemed) {
            setStatus('ERROR');
            setMsg('This code has already been redeemed.');
            return;
        }

        // Success Logic
        // 1. Update Code in Cloud
        const updatedCode = {
            ...targetCode,
            isRedeemed: true,
            redeemedBy: user.id,
            redeemedDate: new Date().toISOString()
        };
        await set(codeRef, updatedCode);

        // 2. Update User Credits
        const newCredits = (user.credits || 0) + targetCode.amount;
        const updatedUser = { 
            ...user, 
            credits: newCredits, 
            redeemedCodes: [...(user.redeemedCodes || []), targetCode.code] 
        };
        
        // Sync to Cloud
        await saveUserToLive(updatedUser);

        // Fallback Local Storage
        localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));

        setStatus('SUCCESS');
        setMsg(`Success! Added ${targetCode.amount} Premium Notes.`);
        setCode('');
        onSuccess(updatedUser);
        
        setTimeout(() => {
            setStatus('IDLE');
            setMsg('');
        }, 3000);

    } catch (e) {
        console.error("Redeem Error:", e);
        setStatus('ERROR');
        setMsg('Network Error. Try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <Gift size={24} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800">Redeem Gift Code</h3>
                <p className="text-xs text-slate-500">Have a code from Admin? Enter it here.</p>
            </div>
        </div>
        
        <div className="relative">
            <input 
                type="text" 
                placeholder="Ex: NST-10-X9Z2..." 
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full pl-4 pr-12 py-3 border-2 border-slate-100 rounded-xl font-mono text-slate-700 focus:outline-none focus:border-purple-500 transition-colors uppercase placeholder:normal-case"
            />
            <button 
                onClick={handleRedeem}
                disabled={status === 'LOADING' || !code}
                className="absolute right-2 top-2 bottom-2 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
                <ArrowRight size={20} />
            </button>
        </div>

        {status === 'ERROR' && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-sm font-medium animate-in slide-in-from-top-1">
                <AlertCircle size={16} /> {msg}
            </div>
        )}
        
        {status === 'SUCCESS' && (
            <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium animate-in slide-in-from-top-1">
                <CheckCircle size={16} /> {msg}
            </div>
        )}
    </div>
  );
};