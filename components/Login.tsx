import React, { useState } from 'react';
import { User } from '../types';
import { School, ArrowRight, Database, Lock, User as UserIcon, AlertTriangle } from 'lucide-react';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  isLoadingData: boolean;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin, isLoadingData }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Cek Master Admin (Hardcoded)
    if (username === 'admin' && password === 'P@ssword') {
        const adminUser: User = {
            username: 'admin',
            name: 'Master Administrator',
            role: 'ADMIN',
            avatar: 'https://ui-avatars.com/api/?name=Admin+Master&background=0D9488&color=fff'
        };
        onLogin(adminUser);
        return;
    }

    // 2. Cek User dari Spreadsheet
    // Karena spreadsheet publik biasanya tidak menyimpan hash password, 
    // kita gunakan password default '123' untuk semua user sheet demi simulasi.
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (foundUser) {
        if (password === '123') {
            onLogin(foundUser);
        } else {
            setError('Password salah. (Default: 123)');
        }
    } else {
        setError('Username tidak ditemukan.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-emerald-600 p-8 text-center relative">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
                <School className="w-8 h-8 text-emerald-600" />
             </div>
             <h1 className="text-2xl font-bold text-white">Smart Ekselensia</h1>
             <p className="text-emerald-100 text-sm mt-2">Sistem Informasi Akademik Terpadu</p>
             
             {isLoadingData && (
                 <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-700/50 px-3 py-1 rounded-full text-xs text-white">
                     <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                     Syncing DB...
                 </div>
             )}
        </div>
        
        <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="text"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white text-sm"
                            placeholder="Masukkan username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="password"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white text-sm"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-right">
                        Default user password: <strong>123</strong>
                    </p>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={isLoadingData}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:shadow-none"
                    >
                        {isLoadingData ? 'Menghubungkan...' : 'Masuk Portal'}
                        {!isLoadingData && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </form>

            {users.length > 0 && (
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Database className="w-3 h-3" />
                    <span>Terhubung ke {users.length} akun database</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};