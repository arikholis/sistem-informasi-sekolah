import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { UserPlus, Search, Shield, Save, X, Upload, FileSpreadsheet, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { parseExcel, mapExcelToUsers } from '../services/excelService';

interface UserManagementProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  currentUserRole: UserRole;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUsers, currentUserRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null); // Username of user being edited
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'STUDENT' as UserRole,
    studentId: '',
    password: ''
  });

  // Visibility Rules
  // Admin sees everything.
  // Headmaster/Vice see everyone EXCEPT Admin.
  const filteredUsers = users.filter(u => {
      if (currentUserRole !== 'ADMIN' && u.role === 'ADMIN') return false;
      
      return u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
             u.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const canManage = currentUserRole === 'ADMIN';

  const handleOpenModal = (userToEdit?: User) => {
      if (userToEdit) {
          setEditingUser(userToEdit.username);
          setFormData({
              username: userToEdit.username,
              name: userToEdit.name,
              role: userToEdit.role,
              studentId: userToEdit.studentId || '',
              password: userToEdit.password || '' 
          });
      } else {
          setEditingUser(null);
          setFormData({ username: '', name: '', role: 'STUDENT', studentId: '', password: '' });
      }
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newUser: User = {
          username: formData.username,
          name: formData.name,
          role: formData.role,
          studentId: formData.role === 'STUDENT' ? formData.studentId : undefined,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
          password: formData.password || '123'
      };

      if (editingUser) {
          // Update existing
          onUpdateUsers(users.map(u => u.username === editingUser ? newUser : u));
      } else {
          // Create new
          if (users.some(u => u.username === formData.username)) {
            alert('Username sudah digunakan!');
            return;
          }
          onUpdateUsers([...users, newUser]);
      }

      setIsModalOpen(false);
      alert(editingUser ? 'Akun berhasil diperbarui!' : 'Akun berhasil dibuat!');
  };

  const handleDelete = (username: string) => {
      if (window.confirm('Yakin ingin menghapus user ini?')) {
          onUpdateUsers(users.filter(u => u.username !== username));
      }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const rawData = await parseExcel(file);
        const newUsers = mapExcelToUsers(rawData);
        
        // Merge strategies: Add new, replace duplicates based on username
        const mergedUsers = [...users];
        newUsers.forEach(nu => {
            const idx = mergedUsers.findIndex(u => u.username === nu.username);
            if (idx >= 0) {
                mergedUsers[idx] = nu;
            } else {
                mergedUsers.push(nu);
            }
        });

        onUpdateUsers(mergedUsers);
        alert(`Berhasil mengimpor ${newUsers.length} data pengguna dari Excel!`);
    } catch (error) {
        console.error(error);
        alert("Gagal membaca file Excel. Pastikan format sesuai.");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Shield className="w-6 h-6 text-emerald-600" />
                Manajemen Akun Pengguna
            </h2>
            <p className="text-slate-500 text-sm mt-1">Buat, edit, dan kelola akses sistem sekolah.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Cari user..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full lg:w-auto"
                />
            </div>
            
            {canManage && (
                <>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors border border-slate-300"
                    >
                        <FileSpreadsheet className="w-4 h-4" /> Upload Excel
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        hidden 
                        accept=".xlsx, .xls" 
                        onChange={handleExcelUpload}
                    />

                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" /> Tambah Akun
                    </button>
                </>
            )}
        </div>
      </div>

      <div className="overflow-auto flex-1 border border-slate-200 rounded-lg relative">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Avatar</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.map((user, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 group transition-colors">
                        <td className="px-6 py-4">
                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="avatar" className="w-8 h-8 rounded-full" />
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{user.username}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{user.name}</td>
                        <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                user.role === 'HEADMASTER' ? 'bg-blue-100 text-blue-700' :
                                user.role === 'VICE_HEADMASTER' ? 'bg-cyan-100 text-cyan-700' :
                                user.role === 'TEACHER' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-slate-100 text-slate-700'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                            {canManage && (
                                <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenModal(user)}
                                        className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.username)}
                                        className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        {editingUser ? <Edit2 className="w-5 h-5"/> : <UserPlus className="w-5 h-5" />} 
                        {editingUser ? 'Edit Data Akun' : 'Buat Akun Baru'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-emerald-100 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            required
                            disabled={!!editingUser} // Cannot change username once created for simplicity
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm disabled:bg-slate-100"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            value={formData.password}
                            placeholder={editingUser ? "Kosongkan jika tidak diubah" : "Isi password"}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        <p className="text-xs text-slate-400 mt-1">Default jika kosong: 123</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role Akun</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="HEADMASTER">Kepala Sekolah</option>
                            <option value="VICE_HEADMASTER">Wakil Kepala Sekolah</option>
                            <option value="TEACHER">Guru</option>
                            <option value="STUDENT">Siswa</option>
                        </select>
                    </div>
                    
                    {formData.role === 'STUDENT' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">ID Siswa (Link ke Database Nilai)</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: SE-101"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                value={formData.studentId}
                                onChange={e => setFormData({...formData, studentId: e.target.value})}
                            />
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-100">
                         <button 
                            type="submit"
                            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Simpan Data
                        </button>
                    </div>
                </form>
             </div>
        </div>
      )}
    </div>
  );
};