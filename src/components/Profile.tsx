import React, { useState } from 'react';
import { User, ClassLevel, Stream, Board } from '../types';
import { Mail, Lock, User as UserIcon, Save, RefreshCw } from 'lucide-react';

interface Props {
    user: User;
    onEdit: () => void;
}

export const Profile: React.FC<Props> = ({ user, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'inbox'>('profile');

  // Use user.inbox if available, otherwise mock
  const messages = user.inbox || [];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 animate-in fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
          >
            <UserIcon size={20} />
            <span>Profile & Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inbox' ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
          >
            <Mail size={20} />
            <span>Inbox</span>
            {messages.some(m => !m.read) && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Info</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <div className="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-800 font-medium">{user.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-1">Login ID</label>
                  <div className="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-800 font-mono">{user.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-1">Email</label>
                  <div className="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-800">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase mb-1">Mobile</label>
                  <div className="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-800">{user.mobile}</div>
                </div>

                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Class</label>
                        <div className="font-bold text-gray-800">{user.classLevel || '10'}</div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Board</label>
                        <div className="font-bold text-gray-800">{user.board || 'CBSE'}</div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Stream</label>
                        <div className="font-bold text-gray-800">{user.stream || 'Science'}</div>
                    </div>
                </div>
              </div>

              <hr className="my-6 border-gray-100" />

              <div className="flex justify-between items-center">
                  <div>
                      <h3 className="font-bold text-gray-800">Account Settings</h3>
                      <p className="text-sm text-gray-500">Update your class, password or stream.</p>
                  </div>
                  <button onClick={onEdit} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 flex items-center transition-colors">
                    <Save className="w-4 h-4 mr-2" />
                    Edit Profile
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
                  <div key={msg.id} className={`p-4 rounded-xl border ${!msg.read ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'} transition-all hover:shadow-md cursor-pointer`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold ${!msg.read ? 'text-blue-800' : 'text-gray-800'}`}>Admin Message</h3>
                      <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{msg.text}</p>
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
};
