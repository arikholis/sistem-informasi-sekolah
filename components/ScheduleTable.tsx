import React, { useState, useRef } from 'react';
import { Schedule, UserRole } from '../types';
import { Plus, Edit2, Trash2, Save, X, FileSpreadsheet } from 'lucide-react';
import { parseExcel, mapExcelToSchedules } from '../services/excelService';

interface ScheduleTableProps {
  data: Schedule[];
  onUpdateSchedule?: (schedules: Schedule[]) => void; // Optional for read-only views
  role?: UserRole;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ data, onUpdateSchedule, role }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Schedule>>({
      day: 'Senin', time: '', subject: '', class: '', teacher: ''
  });

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const classes = Array.from(new Set(data.map(d => d.class))).sort();

  // Permission: Admin, Kepsek, Wakasek, Guru can manage schedule
  const canManage = role && ['ADMIN', 'HEADMASTER', 'VICE_HEADMASTER', 'TEACHER'].includes(role) && !!onUpdateSchedule;

  const handleOpenModal = (schedule?: Schedule) => {
      if (schedule) {
          setEditingId(schedule.id);
          setFormData(schedule);
      } else {
          setEditingId(null);
          setFormData({ day: 'Senin', time: '07:00 - 08:30', subject: '', class: '', teacher: '' });
      }
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!onUpdateSchedule) return;

      const newSchedule = {
          id: editingId || `SCH-${Date.now()}`,
          day: formData.day!,
          time: formData.time!,
          subject: formData.subject!,
          class: formData.class!,
          teacher: formData.teacher!
      };

      if (editingId) {
          onUpdateSchedule(data.map(s => s.id === editingId ? newSchedule : s));
      } else {
          onUpdateSchedule([...data, newSchedule]);
      }
      setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Hapus jadwal ini?') && onUpdateSchedule) {
          onUpdateSchedule(data.filter(s => s.id !== id));
      }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onUpdateSchedule) return;
      const file = e.target.files?.[0];
      if (!file) return;

      try {
          const raw = await parseExcel(file);
          const newSchedules = mapExcelToSchedules(raw);
          onUpdateSchedule([...data, ...newSchedules]);
          alert(`Berhasil menambahkan ${newSchedules.length} jadwal.`);
      } catch (err) {
          alert('Gagal upload Excel.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full p-6 overflow-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Jadwal Pelajaran</h2>
            <p className="text-slate-500 text-sm">Semester Genap 2024/2025</p>
        </div>
        {canManage && (
            <div className="flex gap-2">
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 border border-slate-300"
                >
                    <FileSpreadsheet className="w-4 h-4" /> Excel
                </button>
                <input type="file" ref={fileInputRef} hidden accept=".xlsx, .xls" onChange={handleExcelUpload} />
                
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                >
                    <Plus className="w-4 h-4" /> Tambah
                </button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-400">
                Belum ada jadwal. {canManage && 'Silakan tambah jadwal baru.'}
            </div>
        )}
        {classes.map(cls => (
            <div key={cls} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-emerald-600 text-white px-4 py-2 font-bold text-center flex justify-between items-center">
                    <span>Kelas {cls}</span>
                </div>
                <div className="p-4 bg-slate-50 min-h-[200px]">
                    {days.map(day => {
                        const daySchedules = data.filter(s => s.class === cls && s.day === day).sort((a,b) => a.time.localeCompare(b.time));
                        if (daySchedules.length === 0) return null;

                        return (
                            <div key={day} className="mb-4 last:mb-0">
                                <h4 className="font-bold text-emerald-800 text-xs uppercase mb-2 border-b border-emerald-200 pb-1">{day}</h4>
                                <div className="space-y-2">
                                    {daySchedules.map(sch => (
                                        <div key={sch.id} className="bg-white p-2 rounded shadow-sm border border-slate-100 text-sm relative group">
                                            <div className="flex justify-between items-start pr-6">
                                                <span className="font-bold text-slate-700">{sch.subject}</span>
                                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1 py-0.5 rounded">{sch.time}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                                {sch.teacher}
                                            </div>
                                            
                                            {canManage && (
                                                <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded p-0.5">
                                                    <button onClick={() => handleOpenModal(sch)} className="text-blue-500 hover:text-blue-700"><Edit2 className="w-3 h-3" /></button>
                                                    <button onClick={() => handleDelete(sch.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                <h3 className="text-lg font-bold mb-4 text-slate-800">{editingId ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <select className="w-full p-2 border rounded" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input className="w-full p-2 border rounded" placeholder="Waktu (07:00 - 08:00)" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                    <input className="w-full p-2 border rounded" placeholder="Mata Pelajaran" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
                    <input className="w-full p-2 border rounded" placeholder="Kelas" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} required />
                    <input className="w-full p-2 border rounded" placeholder="Nama Guru" value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} required />
                    
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-2 border rounded hover:bg-slate-50">Batal</button>
                        <button type="submit" className="flex-1 p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Simpan</button>
                    </div>
                </form>
             </div>
          </div>
      )}
    </div>
  );
};