import React, { useState } from 'react';
import { Teacher, UserRole } from '../types';
import { Search, Phone, User, BookOpen, Plus, X, Save, UserPlus, Trash2 } from 'lucide-react';

interface TeacherTableProps {
  data: Teacher[];
  onUpdateData: (newData: Teacher[]) => void;
  role: UserRole;
}

export const TeacherTable: React.FC<TeacherTableProps> = ({ data, onUpdateData, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Teacher>>({
    name: '',
    nip: '',
    subject: '',
    phone: '',
    classTeacher: ''
  });

  // Permission: Admin, Kepsek, Wakasek can add/delete teachers
  const canManage = ['ADMIN', 'HEADMASTER', 'VICE_HEADMASTER'].includes(role);

  const filteredData = data.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject) return;

    const newTeacher: Teacher = {
        id: `GR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        nip: formData.nip || '-',
        subject: formData.subject,
        phone: formData.phone || '-',
        classTeacher: formData.classTeacher || undefined
    };

    onUpdateData([...data, newTeacher]);
    setIsModalOpen(false);
    setFormData({ name: '', nip: '', subject: '', phone: '', classTeacher: '' });
  };

  const handleDelete = (id: string, name: string) => {
      if(window.confirm(`Apakah Anda yakin ingin menghapus data guru "${name}"?`)) {
          onUpdateData(data.filter(t => t.id !== id));
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full relative">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            Direktori Guru & Staf
        </h3>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Cari Guru..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {canManage && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline">Tambah Guru</span>
                </button>
            )}
        </div>
      </div>

      {/* Grid List */}
      <div className="p-4 overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((teacher) => (
            <div key={teacher.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex items-start gap-4 relative group">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">
                    {teacher.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate pr-6">{teacher.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">NIP: {teacher.nip}</p>
                    
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <BookOpen className="w-4 h-4 text-emerald-500" />
                            <span>{teacher.subject}</span>
                        </div>
                        {teacher.classTeacher && (
                             <div className="flex items-center gap-2 text-sm text-slate-600">
                                <User className="w-4 h-4 text-blue-500" />
                                <span>Wali Kelas {teacher.classTeacher}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{teacher.phone}</span>
                        </div>
                    </div>
                </div>
                
                {/* Delete Button */}
                {canManage && (
                    <button 
                        onClick={() => handleDelete(teacher.id, teacher.name)}
                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        title="Hapus Data Guru"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <UserPlus className="w-5 h-5" /> Tambah Data Guru
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-emerald-100 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="Contoh: Bpk. Suryadi"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                            <input 
                                required
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                placeholder="Contoh: Fisika"
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Wali Kelas (Opsional)</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                placeholder="Contoh: XII IPA"
                                value={formData.classTeacher}
                                onChange={e => setFormData({...formData, classTeacher: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">NIP</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                placeholder="Nomor Induk"
                                value={formData.nip}
                                onChange={e => setFormData({...formData, nip: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                placeholder="0812..."
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};