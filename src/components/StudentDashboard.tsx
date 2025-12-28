
import React, { useState, useEffect } from 'react';
import { User, Subject, StudentTab, Chapter, SubjectProgress, ClassLevel, Board, Stream, SystemSettings, PaymentRequest, InboxMessage } from '../types';
import { getSubjectsList } from '../constants';
import { RedeemSection } from './RedeemSection';
import { Zap, Crown, Calendar, Clock, History, Layout, Gift, Sparkles, Megaphone, Lock, BookOpen, AlertCircle, Edit, Settings, Play, Pause, RotateCcw, MessageCircle, Gamepad2, Timer, CreditCard, Send, CheckCircle, Mail, X, Ban, Smartphone } from 'lucide-react';
import { SubjectSelection } from './SubjectSelection';
import { HistoryPage } from './HistoryPage';
import { fetchChapters } from '../services/gemini';
import { UniversalChat } from './UniversalChat';
import { SpinWheel } from './SpinWheel';

interface Props {
  user: User;
  dailyStudySeconds: number; // Received from Global App
  onSubjectSelect: (subject: Subject) => void;
  onRedeemSuccess: (user: User) => void;
  settings?: SystemSettings; // New prop
}

import { Store } from './Store';
import { Profile } from './Profile';

// NEW: Bottom Navigation Component
const BottomNav = ({ activeTab, onTabChange }: { activeTab: StudentTab, onTabChange: (t: StudentTab) => void }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-6 flex justify-between items-center z-40 pb-safe">
            <button onClick={() => onTabChange('ROUTINE')} className={`flex flex-col items-center gap-1 ${activeTab === 'ROUTINE' ? 'text-blue-600' : 'text-slate-400'}`}>
                <Layout size={24} fill={activeTab === 'ROUTINE' ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold">Home</span>
            </button>
            <button onClick={() => onTabChange('CHAT')} className={`flex flex-col items-center gap-1 ${activeTab === 'CHAT' ? 'text-blue-600' : 'text-slate-400'}`}>
                <BookOpen size={24} fill={activeTab === 'CHAT' ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold">Courses</span>
            </button>
            <div className="relative -top-6">
                <button onClick={() => onTabChange('PREMIUM')} className="w-14 h-14 bg-blue-600 rounded-full text-white shadow-xl border-4 border-slate-50 flex items-center justify-center">
                    <Crown size={24} fill="currentColor" />
                </button>
            </div>
            <button onClick={() => onTabChange('REDEEM')} className={`flex flex-col items-center gap-1 ${activeTab === 'REDEEM' ? 'text-blue-600' : 'text-slate-400'}`}>
                <Gift size={24} fill={activeTab === 'REDEEM' ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold">Rewards</span>
            </button>
            <button onClick={() => onTabChange('HISTORY')} className={`flex flex-col items-center gap-1 ${activeTab === 'HISTORY' ? 'text-blue-600' : 'text-slate-400'}`}>
                <UserIcon size={24} fill={activeTab === 'HISTORY' ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold">Profile</span>
            </button>
        </div>
    );
};

export const StudentDashboard: React.FC<Props> = ({ user, dailyStudySeconds, onSubjectSelect, onRedeemSuccess, settings }) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('ROUTINE');
  const globalMessage = localStorage.getItem('nst_global_message');
  
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
      classLevel: user.classLevel || '10',
      board: user.board || 'CBSE',
      stream: user.stream || 'Science',
      newPassword: '' // Field for new password
  });

  const [canClaimReward, setCanClaimReward] = useState(false);
  const DAILY_TARGET = 3 * 3600; // 3 Hours in Seconds
  const REWARD_AMOUNT = settings?.dailyReward || 3;

  // Payment State
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [txnId, setTxnId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'IDLE'|'SUBMITTED'>('IDLE');

  // Inbox
  const [showInbox, setShowInbox] = useState(false);
  const unreadCount = user.inbox?.filter(m => !m.read).length || 0;

  // CONSTANTS FOR PAYMENT
  const ADMIN_PHONE = "8227070298";

  useEffect(() => {
    // Check if reward already claimed today
    const today = new Date().toDateString();
    const lastClaim = user.lastRewardClaimDate ? new Date(user.lastRewardClaimDate).toDateString() : '';
    setCanClaimReward(lastClaim !== today && dailyStudySeconds >= DAILY_TARGET);
  }, [user.lastRewardClaimDate, dailyStudySeconds]);

  const claimDailyReward = () => {
      if (!canClaimReward) return;
      const updatedUser = {
          ...user,
          credits: (user.credits || 0) + REWARD_AMOUNT,
          lastRewardClaimDate: new Date().toISOString()
      };
      const storedUsers = JSON.parse(localStorage.getItem('nst_users') || '[]');
      const userIdx = storedUsers.findIndex((u:User) => u.id === updatedUser.id);
      if (userIdx !== -1) {
          storedUsers[userIdx] = updatedUser;
          localStorage.setItem('nst_users', JSON.stringify(storedUsers));
          localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));
      }
      setCanClaimReward(false);
      onRedeemSuccess(updatedUser);
      alert(`🎉 Congratulations! You studied for 3 Hours.\n\nReceived: ${REWARD_AMOUNT} Free Credits!`);
  };

  const handleWhatsAppPayment = () => {
      if (!selectedPackage || !settings) return;
      const pkg = settings.packages?.find(p => p.id === selectedPackage);
      if (!pkg) return;
      const message = `Hello Admin, I want to buy credits.\n\n📦 Package: ${pkg.name}\n💰 Amount: ₹${pkg.price}\n💎 Credits: ${pkg.credits}\n🆔 Student ID: ${user.id}\n\nPlease approve my request after payment.`;
      const url = `https://wa.me/91${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  const handleSubmitPayment = () => {
      if (!selectedPackage || !txnId || !settings) return;
      const pkg = settings.packages?.find(p => p.id === selectedPackage);
      if (!pkg) return;
      const newRequest: PaymentRequest = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          packageId: pkg.id,
          packageName: pkg.name,
          amount: pkg.credits,
          txnId: txnId,
          status: 'PENDING',
          timestamp: new Date().toISOString()
      };
      const storedRequests = JSON.parse(localStorage.getItem('nst_payment_requests') || '[]');
      localStorage.setItem('nst_payment_requests', JSON.stringify([newRequest, ...storedRequests]));
      setPaymentStatus('SUBMITTED');
      setTxnId('');
      alert("Payment Request Submitted! Admin will review and add credits.");
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const saveProfile = () => {
      const storedUsers = JSON.parse(localStorage.getItem('nst_users') || '[]');
      
      const updatedUser = { 
          ...user, 
          board: profileData.board,
          classLevel: profileData.classLevel,
          stream: profileData.stream,
          password: profileData.newPassword.trim() ? profileData.newPassword : user.password
      };

      const userIdx = storedUsers.findIndex((u:User) => u.id === user.id);
      if(userIdx !== -1) {
          storedUsers[userIdx] = updatedUser;
          localStorage.setItem('nst_users', JSON.stringify(storedUsers));
          localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));
          window.location.reload(); 
      }
      setEditMode(false);
  };
  
  const handleUserUpdate = (updatedUser: User) => {
      const storedUsers = JSON.parse(localStorage.getItem('nst_users') || '[]');
      const userIdx = storedUsers.findIndex((u:User) => u.id === updatedUser.id);
      if (userIdx !== -1) {
          storedUsers[userIdx] = updatedUser;
          localStorage.setItem('nst_users', JSON.stringify(storedUsers));
          localStorage.setItem('nst_current_user', JSON.stringify(updatedUser));
          onRedeemSuccess(updatedUser); 
      }
  };

  const markInboxRead = () => {
      if (!user.inbox) return;
      const updatedInbox = user.inbox.map(m => ({ ...m, read: true }));
      handleUserUpdate({ ...user, inbox: updatedInbox });
  };

  const HomeView = () => {
    return (
        <div className="animate-in fade-in pb-20">
             {/* HERO SECTION */}
             <div className="bg-slate-900 rounded-2xl p-6 text-white mb-6 relative overflow-hidden shadow-2xl group cursor-pointer hover:scale-[1.01] transition-transform">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col items-start">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-black px-2 py-1 rounded mb-2 flex items-center gap-1 uppercase tracking-wider">
                        <Crown size={12} /> Ultra Access
                    </span>
                    <h2 className="text-2xl font-black mb-1">Unlock Premium Learning</h2>
                    <p className="text-slate-400 text-sm mb-4 max-w-[80%]">Get unlimited access to AI Notes, Chapter Analysis, and Private Support.</p>
                    <button onClick={() => setActiveTab('PREMIUM')} className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                        Upgrade Now
                    </button>
                </div>
            </div>

            {/* Global Stats/Timer */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white mb-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                             <Timer size={14} /> Study Timer (Global)
                        </div>
                        <div className="text-4xl font-mono font-bold tracking-wider text-green-400">
                            {formatTime(dailyStudySeconds)}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Target: 3 Hours/Day for {REWARD_AMOUNT} Credits</p>
                    </div>
                </div>
                <div className="mt-4 relative z-10">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.floor((Math.min(dailyStudySeconds, DAILY_TARGET) / DAILY_TARGET) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-1000" style={{ width: `${Math.min((dailyStudySeconds / DAILY_TARGET) * 100, 100)}%` }}></div>
                    </div>
                </div>
                {canClaimReward && (
                    <button onClick={claimDailyReward} className="mt-4 w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold rounded-lg shadow-lg animate-pulse text-xs flex items-center justify-center gap-2">
                        <Crown size={14} /> CLAIM {REWARD_AMOUNT} CREDITS REWARD
                    </button>
                )}
            </div>

            {/* MORE SERVICES GRID (2x4) */}
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Layout size={18} /> More Services</h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
                <button onClick={() => setActiveTab('HISTORY')} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-full mb-1"><History size={20} /></div>
                    <span className="text-[9px] font-bold text-slate-600">History</span>
                </button>
                {settings?.isGameEnabled !== false && (
                    <button onClick={() => setActiveTab('GAME')} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl hover:border-orange-400 hover:shadow-md transition-all">
                        <div className="bg-orange-50 text-orange-600 p-2 rounded-full mb-1"><Gamepad2 size={20} /></div>
                        <span className="text-[9px] font-bold text-slate-600">Game</span>
                    </button>
                )}
                <button onClick={() => setActiveTab('CHAT')} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl hover:border-purple-400 hover:shadow-md transition-all">
                    <div className="bg-purple-50 text-purple-600 p-2 rounded-full mb-1"><MessageCircle size={20} /></div>
                    <span className="text-[9px] font-bold text-slate-600">Chat</span>
                </button>
                <button onClick={() => setActiveTab('REDEEM')} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl hover:border-green-400 hover:shadow-md transition-all">
                    <div className="bg-green-50 text-green-600 p-2 rounded-full mb-1"><Gift size={20} /></div>
                    <span className="text-[9px] font-bold text-slate-600">Redeem</span>
                </button>
                {/* Second Row placeholders or extras */}
                <button onClick={() => setEditMode(true)} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-md transition-all">
                    <div className="bg-slate-50 text-slate-600 p-2 rounded-full mb-1"><Settings size={20} /></div>
                    <span className="text-[9px] font-bold text-slate-600">Settings</span>
                </button>
            </div>
            
            {/* Quick Resume Section (Optional) */}
        </div>
    );
  };

  const CoursesView = () => {
      const subjects = getSubjectsList(user.classLevel || '10', user.stream || null);
      return (
          <div className="animate-in fade-in pb-20">
             <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">My Courses</h3>
             <div className="space-y-3">
                {subjects.map((subj, idx) => {
                    const progress = user.progress?.[subj.id] || { currentChapterIndex: 0, totalMCQsSolved: 0 };
                    return (
                        <div key={idx} onClick={() => onSubjectSelect(subj)} className="p-4 rounded-xl border bg-white border-slate-200 hover:border-[var(--primary)] hover:shadow-md flex items-center gap-4 transition-all cursor-pointer group relative overflow-hidden">
                            <div className={`h-10 w-1 ${subj.color.split(' ')[0]} rounded-full`}></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-slate-800">{subj.name}</h4>
                                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><BookOpen size={12} /> Ch: {progress.currentChapterIndex + 1}</span>
                                    <span className={`flex items-center gap-1 font-bold ${progress.totalMCQsSolved < 100 ? 'text-orange-500' : 'text-green-600'}`}>MCQs: {progress.totalMCQsSolved}/100</span>
                                </div>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-full group-hover:bg-[var(--primary)] text-slate-300 group-hover:text-white transition-colors"><Play size={20} fill="currentColor" /></div>
                        </div>
                    );
                })}
            </div>
          </div>
      );
  };

  const isGameEnabled = settings?.isGameEnabled ?? true;

  return (
    <div className="pb-safe">
        {/* Profile Edit Modal */}
        {editMode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                    <h3 className="font-bold text-lg mb-4">Edit Profile & Settings</h3>
                    <div className="space-y-3 mb-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                            <input 
                                type="text" 
                                placeholder="Set new password (optional)" 
                                value={profileData.newPassword}
                                onChange={e => setProfileData({...profileData, newPassword: e.target.value})}
                                className="w-full p-2 border rounded-lg bg-yellow-50 border-yellow-200"
                            />
                            <p className="text-[9px] text-slate-400 mt-1">Leave blank to keep current password.</p>
                        </div>
                        <div className="h-px bg-slate-100 my-2"></div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Board</label>
                            <select value={profileData.board} onChange={e => setProfileData({...profileData, board: e.target.value as any})} className="w-full p-2 border rounded-lg">
                                <option value="CBSE">CBSE</option>
                                <option value="BSEB">BSEB</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Class</label>
                            <select value={profileData.classLevel} onChange={e => setProfileData({...profileData, classLevel: e.target.value as any})} className="w-full p-2 border rounded-lg">
                                {['6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        {['11','12'].includes(profileData.classLevel) && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Stream</label>
                                <select value={profileData.stream} onChange={e => setProfileData({...profileData, stream: e.target.value as any})} className="w-full p-2 border rounded-lg">
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Arts</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditMode(false)} className="flex-1 py-2 text-slate-500 font-bold">Cancel</button>
                        <button onClick={saveProfile} className="flex-1 py-2 bg-[var(--primary)] text-white rounded-lg font-bold">Save Changes</button>
                    </div>
                </div>
            </div>
        )}

        {/* INBOX MODAL */}
        {showInbox && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Mail size={18} className="text-[var(--primary)]" /> Admin Messages</h3>
                        <button onClick={() => setShowInbox(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                        {(!user.inbox || user.inbox.length === 0) && (
                            <p className="text-slate-400 text-sm text-center py-8">No messages from Admin.</p>
                        )}
                        {user.inbox?.map(msg => (
                            <div key={msg.id} className={`p-3 rounded-xl border text-sm ${msg.read ? 'bg-white border-slate-100' : 'bg-blue-50 border-blue-100'}`}>
                                <p className="text-slate-700 leading-relaxed">{msg.text}</p>
                                <p className="text-[10px] text-slate-400 mt-2 text-right">{new Date(msg.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markInboxRead} className="w-full py-3 bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90">Mark All as Read</button>
                    )}
                </div>
            </div>
        )}

        {globalMessage && (
            <div className="bg-[var(--primary)] text-white p-3 rounded-xl mb-6 flex items-start gap-3 shadow-lg animate-pulse">
                <Megaphone size={20} className="shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Admin Announcement</p>
                    <p className="font-medium text-sm">{globalMessage}</p>
                </div>
            </div>
        )}

        {/* ADMIN FLOATING BUTTON */}
        {user.role === 'ADMIN' && (
            <div className="fixed top-20 right-4 z-50">
                <button onClick={() => window.location.reload()} className="bg-slate-900 text-white p-3 rounded-full shadow-xl border-2 border-white animate-bounce">
                    <LayoutDashboard size={20} />
                </button>
            </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Zap size={20} fill="currentColor" /></div>
                <div><h3 className="text-lg font-black text-slate-800">{user.streak} Days</h3><p className="text-[10px] text-slate-500 uppercase font-bold">Streak</p></div>
            </div>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Crown size={20} fill="currentColor" /></div>
                <div><h3 className="text-lg font-black text-slate-800">{user.credits} Cr</h3><p className="text-[10px] text-slate-500 uppercase font-bold">Credits</p></div>
            </div>
            <div className="relative cursor-pointer" onClick={() => setShowInbox(true)}>
                <div className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-blue-50 hover:text-[var(--primary)] transition-colors"><Mail size={20} /></div>
                {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">{unreadCount}</div>}
            </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="min-h-[500px] pb-24">
            {activeTab === 'ROUTINE' && <HomeView />}
            {activeTab === 'CHAT' && <CoursesView />}

            {/* OTHER VIEWS */}
            {activeTab === 'GAME' && isGameEnabled && (user.isGameBanned ? <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100"><Ban size={48} className="mx-auto text-red-500 mb-4" /><h3 className="text-lg font-bold text-red-700">Access Denied</h3><p className="text-sm text-red-600">Admin has disabled the game for your account.</p></div> : <SpinWheel user={user} onUpdateUser={handleUserUpdate} />)}
            {activeTab === 'HISTORY' && <div className="animate-in fade-in"><Profile user={user} onEdit={() => setEditMode(true)} /></div>}
            {activeTab === 'REDEEM' && <div className="animate-in fade-in slide-in-from-bottom-2 duration-300"><RedeemSection user={user} onSuccess={onRedeemSuccess} /></div>}
            {activeTab === 'PREMIUM' && <div className="animate-in zoom-in duration-300"><Store user={user} /></div>}
        </div>

        {/* BOTTOM NAV */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
