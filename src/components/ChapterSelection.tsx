import React from 'react';
import { Chapter, Subject, ClassLevel, User } from '../types';
import { BookOpen, ChevronRight, Lock, CheckCircle, PlayCircle, Clock, Star, Play, Coins, Crown } from 'lucide-react';

interface Props {
  chapters: Chapter[];
  subject: Subject;
  classLevel: ClassLevel;
  loading: boolean;
  user: User | null;
  onSelect: (chapter: Chapter) => void;
  onBack: () => void;
}

export const ChapterSelection: React.FC<Props> = ({ 
  chapters, 
  subject, 
  classLevel, 
  loading, 
  user,
  onSelect, 
  onBack 
}) => {
  
  // Get current progress for this subject
  const userProgress = user?.progress?.[subject.id] || { currentChapterIndex: 0, totalMCQsSolved: 0 };
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
       <div className="flex items-center mb-8 sticky top-0 bg-slate-50 py-4 z-10">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 transition-colors mr-4 font-medium flex items-center gap-1">
           Back
        </button>
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
             <span>Class {classLevel}</span>
             <span>/</span>
             <span className="font-medium text-slate-700">{subject.name}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Syllabus & Chapters</h2>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="h-24 bg-white rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {chapters.map((chapter, index) => {
            // Logic for Lock/Unlock
            const isCompleted = index < userProgress.currentChapterIndex;
            const isCurrent = index === userProgress.currentChapterIndex;
            const isLocked = !isAdmin && index > userProgress.currentChapterIndex;
            
            return (
              <div
                key={chapter.id}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                    isLocked 
                    ? 'bg-white border-2 border-slate-200 opacity-90'
                    : 'bg-white border-2 border-blue-100 shadow-md hover:shadow-xl hover:scale-[1.01]'
                }`}
              >
                {/* VIDEO THUMBNAIL PLACEHOLDER CARD */}
                <div className="relative h-40 bg-slate-800 group cursor-pointer" onClick={() => !isLocked && onSelect(chapter)}>
                    {/* Fake Thumbnail Image */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <PlayCircle size={64} className="text-white" />
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                         <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                             <BookOpen size={10} /> Free Notes
                         </span>
                         <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                             <Crown size={10} /> Premium Notes
                         </span>
                    </div>

                    {/* LOCK OVERLAY */}
                    {isLocked && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                            <Lock size={40} className="mb-2 text-slate-300" />
                            <p className="font-bold text-lg">Locked Content</p>
                            <p className="text-xs text-slate-300 mb-4">Complete previous chapter to unlock</p>

                            <div className="flex gap-3">
                                <button className="bg-yellow-500 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-yellow-400 flex items-center gap-1 transition-transform hover:scale-105">
                                    <Coins size={14} /> Play with Coins
                                </button>
                                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:opacity-90 flex items-center gap-1 transition-transform hover:scale-105">
                                    <Crown size={14} /> Unlock with Ultra
                                </button>
                            </div>
                        </div>
                    )}

                    {!isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border-2 border-white scale-75 group-hover:scale-100 transition-transform duration-300">
                                <Play size={32} fill="currentColor" className="ml-1" />
                            </div>
                        </div>
                    )}

                    {/* DURATION BADGE */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Clock size={10} /> 45:00
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chapter {(index + 1).toString().padStart(2, '0')}</p>
                             <h3 className="font-bold text-lg text-slate-800 leading-tight">{chapter.title}</h3>
                        </div>
                        {isCurrent && <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-200" title="Current Active Chapter"></div>}
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="mt-4">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                             <span>MCQ Mastery</span>
                             <span className={isCompleted ? 'text-green-600' : 'text-orange-500'}>
                                 {index < userProgress.currentChapterIndex ? '100%' : `${Math.min(userProgress.totalMCQsSolved, 100)}%`}
                             </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div
                                className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-orange-400'}`}
                                style={{ width: `${index < userProgress.currentChapterIndex ? 100 : Math.min(userProgress.totalMCQsSolved, 100)}%` }}
                             ></div>
                        </div>
                    </div>

                    {/* ACTION FOOTER */}
                    {!isLocked && (
                         <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                             <button onClick={() => onSelect(chapter)} className="flex-1 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-100">
                                 Start Learning
                             </button>
                         </div>
                    )}
                </div>
              </div>
            );
          })}
          
          {chapters.length === 0 && !loading && (
             <div className="text-center py-20 text-slate-400">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50"/>
                <p>No chapters found. Please try refreshing.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};