import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Save, RefreshCw } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'inbox'>('profile');

  // Mock Inbox Messages
  const messages = [
    { id: 1, from: 'Admin', subject: 'Welcome to NST AI', body: 'Hi Rahul, welcome to the platform! Use code WELCOME50 for 50 free credits.', date: '2 days ago', unread: true },
    { id: 2, from: 'System', subject: 'Physics Notes Updated', body: 'The Chapter 4 notes have been refreshed with new diagrams.', date: '1 week ago', unread: false },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
          >
            <User size={20} />
            <span>Profile & Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inbox' ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
          >
            <Mail size={20} />
            <span>Inbox</span>
            {messages.some(m => m.unread) && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full border rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select className="w-full border rounded-lg px-4 py-2">
                    <option>Class 10</option>
                    <option>Class 11</option>
                    <option>Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                  <select className="w-full border rounded-lg px-4 py-2">
                    <option>Science</option>
                    <option>Commerce</option>
                    <option>Arts</option>
                  </select>
                </div>
              </div>

              <hr className="my-6 border-gray-100" />

              <h2 className="text-xl font-bold text-gray-800 mb-4">Security</h2>
              <div className="space-y-4 max-w-md">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="password" placeholder="New Password" className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="password" placeholder="Confirm Password" className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                <button className="text-gray-400 hover:text-blue-600"><RefreshCw size={18} /></button>
              </div>
              
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`p-4 rounded-xl border ${msg.unread ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'} transition-all hover:shadow-md cursor-pointer`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold ${msg.unread ? 'text-blue-800' : 'text-gray-800'}`}>{msg.subject}</h3>
                      <span className="text-xs text-gray-400">{msg.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{msg.body}</p>
                    <div className="mt-2 flex items-center text-xs font-medium text-gray-500">
                      <span className="bg-gray-200 px-2 py-0.5 rounded mr-2">From: {msg.from}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No messages in your inbox.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
