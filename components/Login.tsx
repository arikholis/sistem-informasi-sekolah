import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';
import { School, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUsername, setSelectedUsername] = useState(MOCK_USERS[0].username);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.username === selectedUsername);
    if (user) {
        onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-emerald-600 p-8 text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
                <School className="w-8 h-8 text-emerald-600" />
             </div>
             <h1 className="text-2xl font-bold text-white">Smart Ekselensia</h1>
             <p className="text-emerald-100 text-sm mt-2">Sistem Informasi Akademik Terpadu</p>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Akun (Simulasi)</label>
                    <select 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                        value={selectedUsername}
                        onChange={(e) => setSelectedUsername(e.target.value)}
                    >
                        {MOCK_USERS.map(u => (
                            <option key={u.username} value={u.username}>
                                {u.name} — {u.role}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2 bg-slate-100 p-2 rounded">
                        *Dalam mode demo offline, pilih role untuk masuk tanpa password.
                    </p>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                    Masuk Portal
                    <ArrowRight className="w-4 h-4" />
                </button>
            </form>
        </div>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400">Powered by Smart Database System</p>
        </div>
      </div>
    </div>
  );
};
