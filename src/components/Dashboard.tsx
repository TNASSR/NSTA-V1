import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SUBJECT_COLORS } from '../constants';
import { BookOpen, Trophy, Clock, Zap, Lock, PlayCircle, Gift } from 'lucide-react';
import { DUMMY_CHAPTERS } from '../lib/gemini';
import { MathRenderer } from './MathRenderer';
import TermsModal from './TermsModal';
import SpinWheel from './SpinWheel';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showWheel, setShowWheel] = useState(false);
  const subjects = user?.stream === 'Arts' 
    ? ['History', 'Geography', 'Political Science']
    : ['Physics', 'Chemistry', 'Biology', 'Math'];

  // Helper to check if a subject is locked
  const isSubjectLocked = (subject: string) => {
      if (user?.role === 'ADMIN') return false;

      // Check global class lock (from Admin Dashboard)
      const lockedClasses = JSON.parse(localStorage.getItem('nst_locked_classes') || '[]');
      if (user?.class && lockedClasses.includes(user.class)) return true;

      // Mock: Chemistry is locked for demo purposes as well
      return subject === 'Chemistry';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <TermsModal onAccept={() => console.log("Terms Accepted")} />
      
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-500 mt-2">Let's continue your learning journey.</p>
        </div>
        <button 
          onClick={() => setShowWheel(true)}
          className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <Gift size={20} className="animate-pulse" />
          <span>Daily Spin</span>
        </button>
      </header>

      <SpinWheel isOpen={showWheel} onClose={() => setShowWheel(false)} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          onClick={() => setShowWheel(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg cursor-pointer md:hidden relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Gift size={100} />
          </div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold opacity-90">Daily Reward</h3>
            <Gift className="opacity-75" />
          </div>
          <p className="text-xl font-bold">Spin Now</p>
          <p className="text-xs opacity-75 mt-1">Win free credits</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold opacity-90">Credits</h3>
            <Zap className="opacity-75" />
          </div>
          <p className="text-3xl font-bold">{user?.credits}</p>
          <p className="text-xs opacity-75 mt-1">Available for notes</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4 text-orange-500">
            <h3 className="font-semibold text-gray-700">Daily Streak</h3>
            <Trophy />
          </div>
          <p className="text-3xl font-bold text-gray-800">12 Days</p>
          <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4 text-green-500">
            <h3 className="font-semibold text-gray-700">Study Time</h3>
            <Clock />
          </div>
          <p className="text-3xl font-bold text-gray-800">2.5 hrs</p>
          <p className="text-xs text-gray-500 mt-1">Today's progress</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4 text-purple-500">
            <h3 className="font-semibold text-gray-700">Chapters</h3>
            <BookOpen />
          </div>
          <p className="text-3xl font-bold text-gray-800">18/45</p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>
      </div>

      {/* Subjects Grid */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">Your Subjects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {subjects.map((subject) => {
          const locked = isSubjectLocked(subject);
          return (
            <div 
              key={subject} 
              onClick={() => {
                if (!locked) {
                  // In a real app we'd go to subject view, here we go straight to a chapter for demo
                  navigate('/chapter/c1');
                }
              }}
              className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group relative ${locked ? 'opacity-75' : ''}`}
            >
              {locked && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <Lock className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              )}
              
              <div className={`h-2 ${SUBJECT_COLORS[subject as keyof typeof SUBJECT_COLORS] || 'bg-gray-500'}`} />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{subject}</h3>
                  {!locked && <PlayCircle className="w-5 h-5 text-blue-100 group-hover:text-blue-500 transition-colors" />}
                </div>
                <p className="text-sm text-gray-500 mb-4">{locked ? 'Upgrade to unlock' : 'Click to view chapters'}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">0% Completed</span>
                  <span className={`font-medium group-hover:underline ${locked ? 'text-gray-400' : 'text-blue-600'}`}>
                    {locked ? 'Locked' : 'Start Learning →'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Math Preview (KaTeX) */}
      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <BookOpen size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Today's Featured Formula</h2>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <MathRenderer content="The mass-energy equivalence is given by $$E = mc^2$$. Also, the quadratic formula is $$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$" />
        </div>
      </div>
    </div>
  );
}
