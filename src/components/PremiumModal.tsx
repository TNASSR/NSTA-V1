
import React from 'react';
import { Chapter, ContentType } from '../types';
import { Crown, BookOpen, Lock, X, HelpCircle, FileQuestion } from 'lucide-react';

interface Props {
  chapter: Chapter;
  credits: number;
  isAdmin: boolean;
  onSelect: (type: ContentType) => void;
  onClose: () => void;
}

export const PremiumModal: React.FC<Props> = ({ chapter, credits, isAdmin, onSelect, onClose }) => {
  // NOTES_SIMPLE (FREE)
  // MCQ_SIMPLE (FREE)
  // NOTES_PREMIUM / PDF (5 Credits)
  // MCQ_ANALYSIS (Premium MCQ) (2 Credits)

  const canAffordPremiumNotes = credits >= 5 || isAdmin;
  const canAffordPremiumMCQ = credits >= 2 || isAdmin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={24} />
            </button>
            
            <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{chapter.title}</h3>
                <p className="text-slate-500 text-sm mb-6">Choose your learning experience</p>
                
                <div className="space-y-3">
                    {/* Free Option - Simple Notes */}
                    <button 
                        onClick={() => onSelect('NOTES_SIMPLE')}
                        className="w-full flex items-center p-3 rounded-xl border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group text-left"
                    >
                        <div className="bg-slate-100 p-3 rounded-lg text-slate-500 mr-4 group-hover:bg-white group-hover:shadow-sm">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 text-sm">Simple Note</div>
                            <div className="text-[10px] text-slate-400">Standard text format.</div>
                            <div className="text-[9px] font-bold text-green-600 uppercase tracking-wider mt-0.5">FREE</div>
                        </div>
                    </button>

                    {/* Free Option - Normal MCQ */}
                    <button 
                        onClick={() => onSelect('MCQ_SIMPLE')}
                        className="w-full flex items-center p-3 rounded-xl border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group text-left"
                    >
                        <div className="bg-green-100 p-3 rounded-lg text-green-600 mr-4 group-hover:bg-white group-hover:shadow-sm">
                            <FileQuestion size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 text-sm">Normal Practice</div>
                            <div className="text-[10px] text-slate-400">5 Questions. Standard level.</div>
                            <div className="text-[9px] font-bold text-green-600 uppercase tracking-wider mt-0.5">FREE</div>
                        </div>
                    </button>

                </div>
            </div>
            
            {!canAffordPremiumNotes && !isAdmin && (
                <div className="bg-slate-50 p-3 text-center text-[10px] text-slate-500 border-t border-slate-100">
                    Need credits? Study for 3 Hours or use the Spin Wheel!
                </div>
            )}
        </div>
    </div>
  );
};
