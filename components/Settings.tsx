import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Save, CheckCircle, ShieldAlert } from 'lucide-react';

interface SettingsProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateUser }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Simple validation
    // Note: In a real app, we would verify 'current' password against backend
    if (passwords.new !== passwords.confirm) {
        setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
        return;
    }

    if (passwords.new.length < 4) {
        setMessage({ type: 'error', text: 'Password minimal 4 karakter.' });
        return;
    }

    // Update User
    const updatedUser = { ...currentUser, password: passwords.new };
    onUpdateUser(updatedUser);
    
    setMessage({ type: 'success', text: 'Password berhasil diperbarui!' });
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                Pengaturan Keamanan
            </h2>
            <p className="text-sm text-slate-500 mt-1">Ubah password akun Anda secara berkala.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                <input 
                    type="text" 
                    disabled
                    value={currentUser.username}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                />
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password Lama</label>
                    <input 
                        type="password" 
                        required
                        value={passwords.current}
                        onChange={e => setPasswords({...passwords, current: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Masukkan password saat ini"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password Baru</label>
                        <input 
                            type="password" 
                            required
                            value={passwords.new}
                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Password baru"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Password</label>
                        <input 
                            type="password" 
                            required
                            value={passwords.confirm}
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Ulangi password baru"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                    type="submit"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-100"
                >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};