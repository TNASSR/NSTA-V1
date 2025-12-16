import React from 'react';
import { ShieldCheck, Book, MessageCircle, AlertTriangle } from 'lucide-react';

export default function Rules() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Rules & Guidelines / नियम और शर्तें</h1>

      <div className="space-y-8">
        <section>
          <div className="flex items-center mb-4 text-blue-600">
            <Book className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">1. Content Usage / सामग्री का उपयोग</h2>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-gray-700 mb-2"><strong>English:</strong> All study material provided is for personal use only. Sharing screenshots or PDFs with non-registered users is strictly prohibited.</p>
            <p className="text-gray-700"><strong>Hindi:</strong> प्रदान की गई सभी अध्ययन सामग्री केवल व्यक्तिगत उपयोग के लिए है। गैर-पंजीकृत उपयोगकर्ताओं के साथ स्क्रीनशॉट या पीडीएफ साझा करना सख्त मना है।</p>
          </div>
        </section>

        <section>
          <div className="flex items-center mb-4 text-purple-600">
            <MessageCircle className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">2. Chat Etiquette / चैट के नियम</h2>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-gray-700 mb-2"><strong>English:</strong> Abusive language, spamming, or sharing external links in the Universal Chat will lead to an immediate ban.</p>
            <p className="text-gray-700"><strong>Hindi:</strong> यूनिवर्सल चैट में अभद्र भाषा, स्पैमिंग या बाहरी लिंक साझा करने पर तुरंत प्रतिबंध (Ban) लगा दिया जाएगा।</p>
          </div>
        </section>

        <section>
          <div className="flex items-center mb-4 text-green-600">
            <ShieldCheck className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">3. Account Security / खाता सुरक्षा</h2>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-gray-700 mb-2"><strong>English:</strong> Do not share your password. The Admin will never ask for your password via chat.</p>
            <p className="text-gray-700"><strong>Hindi:</strong> अपना पासवर्ड साझा न करें। एडमिन कभी भी चैट के माध्यम से आपसे आपका पासवर्ड नहीं मांगेंगे।</p>
          </div>
        </section>

        <div className="bg-red-50 p-4 rounded-lg flex items-start border border-red-100">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
                <strong>Disclaimer:</strong> This app uses AI to generate content. While we strive for accuracy, please cross-verify critical information with standard textbooks.
            </p>
        </div>
      </div>
    </div>
  );
}
