import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MathRenderer } from './MathRenderer';
import { DUMMY_CHAPTERS, getOrGenerateChapterContent } from '../lib/gemini';
import { ArrowLeft, Play, Pause, FileText, Bot, Download, RefreshCw } from 'lucide-react';

export default function ChapterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'AI' | 'PDF'>('AI');
  const [content, setContent] = useState<string>('');
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  const chapter = DUMMY_CHAPTERS.find(c => c.id === id) || DUMMY_CHAPTERS[0];

  const fetchContent = async (force: boolean = false) => {
      setLoading(true);
      setProgress(10);
      
      const interval = setInterval(() => {
          setProgress(old => {
              if (old >= 90) return 90;
              return old + Math.random() * 10;
          });
      }, 300);

      try {
          const systemPrompt = localStorage.getItem('nst_system_prompt') || "Explain like a friendly teacher.";
          
          // Use Smart Caching Wrapper
          const aiText = await getOrGenerateChapterContent(
              chapter.id, 
              chapter.title, 
              chapter.subject, 
              systemPrompt,
              force
          );
          
          setContent(aiText);
          setIsUsingFallback(false);
      } catch (error) {
          console.log("Using fallback content");
          setContent(chapter.content || "No content available.");
          setIsUsingFallback(true);
      } finally {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => setLoading(false), 500);
      }
  };

  useEffect(() => {
    fetchContent(false); // Check cache first
  }, [chapter.id]);

  const handleRegenerate = () => {
      if (confirm("Are you sure? This will use credits/API and overwrite the existing notes for everyone.")) {
          fetchContent(true); // Force regenerate
      }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would trigger the Web Speech API
    if (!isPlaying) {
      const utterance = new SpeechSynthesisUtterance(chapter.content || "");
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between text-sm font-medium text-gray-600">
            <span>Generating Intelligent Notes...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-gray-400 animate-pulse">
            Analyzing {chapter.subject} patterns • Optimizing diagrams • Checking facts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </button>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6">
        <div>
          <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">{chapter.subject}</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-1">{chapter.title}</h1>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button 
            onClick={toggleAudio}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            {isPlaying ? <Pause size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
            {isPlaying ? 'Stop Audio' : 'Listen'}
          </button>
          
          {user?.role === 'ADMIN' && (
            <button 
                onClick={handleRegenerate}
                className="flex items-center px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                title="Admin: Force Regenerate Notes"
            >
                <RefreshCw size={18} className="mr-2" />
                Regenerate
            </button>
          )}

          <button 
            onClick={() => setViewMode(viewMode === 'AI' ? 'PDF' : 'AI')}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            {viewMode === 'AI' ? <FileText size={18} className="mr-2" /> : <Bot size={18} className="mr-2" />}
            {viewMode === 'AI' ? 'View Original PDF' : 'View AI Notes'}
          </button>
        </div>
      </header>

      {viewMode === 'AI' ? (
        <div className="prose prose-lg max-w-none text-gray-700">
          <div className={`p-4 rounded-lg border mb-6 text-sm flex items-start ${isUsingFallback ? 'bg-orange-50 border-orange-100 text-orange-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
            <Bot className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            {isUsingFallback 
                ? "Offline Mode: Showing pre-saved content. Connect to internet and add API Key for live AI." 
                : "Live AI: These notes were just generated by Gemini specifically for you."}
          </div>
          
          <MathRenderer content={content} />
          
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Practice Question</h3>
            <p className="mb-4">Explain the significance of this topic in daily life.</p>
            <textarea 
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Type your answer here..." 
              rows={3}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
              Check with AI
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-xl h-[600px] flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600">Manual PDF View</h3>
            <p className="text-gray-500 mb-6">This allows admins to upload their own notes.</p>
            <button className="flex items-center mx-auto bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
