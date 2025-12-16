import React from 'react';
import { Award, Star, TrendingUp } from 'lucide-react';

export default function IICGallery() {
  const photos = [
    { id: 1, title: 'Annual Function 2024', color: 'bg-red-200' },
    { id: 2, title: 'Toppers Felicitation', color: 'bg-blue-200' },
    { id: 3, title: 'Science Exhibition', color: 'bg-green-200' },
    { id: 4, title: 'Sports Day', color: 'bg-yellow-200' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight">Ideal Inspiration Classes</h1>
        <p className="text-xl text-blue-600 font-medium">Shaping Future Leaders Since 2010</p>
        <div className="flex justify-center mt-6 space-x-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <Award className="w-4 h-4 mr-1" /> No. 1 Institute
            </span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <Star className="w-4 h-4 mr-1" /> 100% Results
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-600">
            <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Director's Message</h2>
            <p className="text-gray-600 leading-relaxed italic">
                "Education is not just about learning facts, but about training the mind to think. At IIC, we believe in empowering every student to achieve their maximum potential through discipline and dedication."
            </p>
            <p className="mt-4 font-bold text-gray-800 text-right">- R.K. Sharma</p>
        </div>

        <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
            <ul className="space-y-3">
                <li className="flex items-center"><div className="w-2 h-2 bg-white rounded-full mr-3"/> Experienced Faculty</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-white rounded-full mr-3"/> AI-Powered Digital Support</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-white rounded-full mr-3"/> Personal Attention</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-white rounded-full mr-3"/> Regular Tests & Analysis</li>
            </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Life at IIC</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
            <div key={photo.id} className={`aspect-square ${photo.color} rounded-xl flex items-end p-4 transition-transform hover:scale-105 cursor-pointer shadow-sm`}>
                <span className="font-bold text-gray-800 opacity-75">{photo.title}</span>
            </div>
        ))}
      </div>
    </div>
  );
}
