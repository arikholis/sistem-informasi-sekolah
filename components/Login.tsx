import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { School, ArrowRight, Database, AlertCircle } from 'lucide-react';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  isLoadingData: boolean;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin, isLoadingData }) => {
  const [selectedUsername, setSelectedUsername] = useState('');

  useEffect(() => {
      if (users.length > 0) {
          setSelectedUsername(users[0].username);
      }
  }, [users]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === selectedUsername);
    if (user) {
        onLogin(user);
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
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Akun</label>
                    {isLoadingData ? (
                        <div className="w-full h-12 bg-slate-100 rounded-lg animate-pulse"></div>
                    ) : users.length > 0 ? (
                        <select 
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                            value={selectedUsername}
                            onChange={(e) => setSelectedUsername(e.target.value)}
                        >
                            {users.map(u => (
                                <option key={u.username} value={u.username}>
                                    {u.name} — {u.role}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-red-700">Data Akun Tidak Ditemukan</p>
                                <p className="text-xs text-red-600 mt-1">
                                    Gagal memuat data dari Spreadsheet. Pastikan dokumen Google Sheet sudah dipublikasikan ke web (Format CSV).
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {users.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                            <Database className="w-3 h-3" />
                            Terhubung ke Database Spreadsheet
                        </div>
                    )}
                </div>

                <button 
                    type="submit"
                    disabled={isLoadingData || users.length === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:shadow-none"
                >
                    {isLoadingData ? 'Memuat...' : 'Masuk Portal'}
                    {!isLoadingData && <ArrowRight className="w-4 h-4" />}
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