import React, { useState } from 'react';
import { Student, UserRole } from '../types';
import { Download, Search, Trash2, Save, Edit2, Plus } from 'lucide-react';

interface SpreadsheetTableProps {
  data: Student[];
  onUpdateData: (newData: Student[]) => void;
  role: UserRole;
}

export const SpreadsheetTable: React.FC<SpreadsheetTableProps> = ({ data, onUpdateData, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Student>>({});

  // Permission check: Admin, Guru, Kepsek, Wakasek bisa melakukan CRUD
  const canEdit = ['ADMIN', 'TEACHER', 'HEADMASTER', 'VICE_HEADMASTER'].includes(role);

  // Filter data
  const filteredData = data.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['ID,Nama,Kelas,Matematika,IPA,Bahasa Inggris,PAI,Kehadiran,Perilaku'];
    const rows = data.map(s => 
      `${s.id},${s.name},${s.class},${s.math},${s.science},${s.english},${s.islamicStudies},${s.attendance},${s.behavior}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "database_siswa_smart_ekselensia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CREATE: Tambah Data Baru
  const handleAddStudent = () => {
      const newId = `SE-${Math.floor(100 + Math.random() * 900)}`; // Generate Random ID
      const newStudent: Student = {
          id: newId,
          name: '',
          class: 'XA',
          math: 0,
          science: 0,
          english: 0,
          islamicStudies: 0,
          attendance: 0,
          behavior: 'Baik'
      };
      
      // Tambahkan ke paling atas
      onUpdateData([newStudent, ...data]);
      
      // Langsung masuk mode edit
      setEditingId(newId);
      setEditForm(newStudent);
  };

  // UPDATE: Mulai Edit
  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditForm({ ...student });
  };

  // UPDATE: Simpan Perubahan
  const handleSaveEdit = () => {
    if (!editingId) return;
    
    const updatedData = data.map(s => 
        s.id === editingId ? { ...s, ...editForm } as Student : s
    );
    onUpdateData(updatedData);
    setEditingId(null);
    setEditForm({});
  };

  // DELETE: Hapus Data
  const handleDelete = (id: string) => {
      if(window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
          onUpdateData(data.filter(s => s.id !== id));
      }
  }

  const handleChange = (field: keyof Student, value: any) => {
      setEditForm(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-green-50/30">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari di database (Nama, ID, Kelas)..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
              <button 
                onClick={handleAddStudent}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Siswa
              </button>
          )}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700 font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export XLS
          </button>
        </div>
      </div>

      {/* Spreadsheet Container */}
      <div className="overflow-auto flex-1 spreadsheet-scroll bg-slate-50">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-emerald-50 sticky top-0 z-10 shadow-sm">
            <tr>
              {['ID', 'Nama Siswa', 'Kelas', 'Matematika', 'IPA', 'B. Inggris', 'PAI', 'Kehadiran', 'Perilaku', ...(canEdit ? ['Aksi'] : [])].map((header, i) => (
                <th key={i} className="px-4 py-3 text-xs font-bold text-emerald-800 uppercase tracking-wider border border-emerald-100 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredData.map((student, idx) => {
                const isEditing = editingId === student.id;
                return (
                    <tr key={student.id} className={`hover:bg-slate-50 transition-colors group ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} ${isEditing ? 'bg-blue-50' : ''}`}>
                        <td className="px-4 py-2 text-sm text-slate-500 font-mono border border-slate-100">
                            {isEditing ? (
                                <input 
                                    className="border border-blue-300 rounded px-2 py-1 w-20 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={editForm.id} 
                                    onChange={(e) => handleChange('id', e.target.value)} 
                                    placeholder="ID"
                                />
                            ) : student.id}
                        </td>
                        
                        <td className="px-4 py-2 text-sm text-slate-900 font-medium border border-slate-100">
                            {isEditing ? (
                                <input 
                                    className="border border-blue-300 rounded px-2 py-1 w-full text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={editForm.name} 
                                    onChange={(e) => handleChange('name', e.target.value)} 
                                    placeholder="Nama Siswa"
                                />
                            ) : student.name}
                        </td>

                        <td className="px-4 py-2 text-sm text-slate-600 text-center border border-slate-100">
                            {isEditing ? (
                                <input 
                                    className="border border-blue-300 rounded px-2 py-1 w-16 text-center text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={editForm.class} 
                                    onChange={(e) => handleChange('class', e.target.value)} 
                                    placeholder="Kls"
                                />
                            ) : <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold">{student.class}</span>}
                        </td>

                        {/* Scores */}
                        {['math', 'science', 'english', 'islamicStudies'].map((subject) => (
                             <td key={subject} className="px-4 py-2 text-sm text-slate-600 text-center border border-slate-100">
                                {isEditing ? (
                                    <input 
                                        type="number"
                                        className="border border-blue-300 rounded px-1 py-1 w-14 text-center text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                        value={editForm[subject as keyof Student] as number} 
                                        onChange={(e) => handleChange(subject as keyof Student, Number(e.target.value))} 
                                    />
                                ) : (
                                    <span className={(student[subject as keyof Student] as number) < 70 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                                        {student[subject as keyof Student]}
                                    </span>
                                )}
                             </td>
                        ))}
                        
                        <td className="px-4 py-2 text-sm text-slate-600 text-center border border-slate-100">
                             {isEditing ? (
                                <input 
                                    type="number"
                                    className="border border-blue-300 rounded px-1 py-1 w-14 text-center text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={editForm.attendance} 
                                    onChange={(e) => handleChange('attendance', Number(e.target.value))} 
                                />
                            ) : (
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${student.attendance < 80 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {student.attendance}%
                                </span>
                            )}
                        </td>

                        <td className="px-4 py-2 text-sm text-slate-600 text-center border border-slate-100">
                             {isEditing ? (
                                <select 
                                    className="border border-blue-300 rounded px-1 py-1 w-full text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={editForm.behavior} 
                                    onChange={(e) => handleChange('behavior', e.target.value)} 
                                >
                                    <option value="Baik">Baik</option>
                                    <option value="Cukup">Cukup</option>
                                    <option value="Perlu Bimbingan">Perlu Bimbingan</option>
                                </select>
                            ) : (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    student.behavior === 'Baik' ? 'text-emerald-700' :
                                    student.behavior === 'Cukup' ? 'text-blue-700' :
                                    'text-rose-700'
                                }`}>
                                    {student.behavior}
                                </span>
                            )}
                        </td>

                        {canEdit && (
                            <td className="px-4 py-2 text-sm text-center border border-slate-100">
                                {isEditing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={handleSaveEdit} className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-50 rounded" title="Simpan">
                                            <Save className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-100 rounded" title="Batal">
                                            X
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleStartEdit(student)} className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded" title="Edit Data">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(student.id)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded" title="Hapus Data">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </td>
                        )}
                    </tr>
                );
            })}
          </tbody>
        </table>
        {filteredData.length === 0 && (
             <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                <Search className="w-8 h-8 mb-2 opacity-50" />
                <p>Data tidak ditemukan dalam database.</p>
                {canEdit && (
                    <button onClick={handleAddStudent} className="mt-4 text-emerald-600 hover:underline">
                        + Tambah Siswa Baru
                    </button>
                )}
             </div>
        )}
      </div>
      <div className="bg-slate-50 border-t border-slate-200 p-2 text-xs text-slate-500 flex justify-between px-4">
        <span>Menampilkan {filteredData.length} baris</span>
        <span>Mode: {canEdit ? 'Admin/Editor (Dapat Menginput Nilai)' : 'Read-Only'}</span>
      </div>
    </div>
  );
};