import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';

interface TermsModalProps {
  onAccept: () => void;
}

export default function TermsModal({ onAccept }: TermsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('nst_terms_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nst_terms_accepted', 'true');
    setIsOpen(false);
    onAccept();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-blue-600 p-6 text-white text-center">
          <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold">Welcome to Gemini Apps</h2>
          <p className="text-blue-100 mt-2">Before we start, please agree to our rules.</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">I will use the AI content for educational purposes only.</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">I will not share my account password with anyone.</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">I understand that the Admin monitors chat for safety.</p>
            </div>
          </div>

          <button
            onClick={handleAccept}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center group"
          >
            I Agree & Continue
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
