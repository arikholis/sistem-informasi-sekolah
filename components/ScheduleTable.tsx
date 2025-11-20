import React from 'react';
import { Schedule } from '../types';

interface ScheduleTableProps {
  data: Schedule[];
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ data }) => {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const classes = Array.from(new Set(data.map(d => d.class))).sort();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Jadwal Pelajaran</h2>
        <p className="text-slate-500 text-sm">Semester Genap 2024/2025</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
            <div key={cls} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-emerald-600 text-white px-4 py-2 font-bold text-center">
                    Kelas {cls}
                </div>
                <div className="p-4 bg-slate-50">
                    {days.map(day => {
                        const daySchedules = data.filter(s => s.class === cls && s.day === day);
                        if (daySchedules.length === 0) return null;

                        return (
                            <div key={day} className="mb-4 last:mb-0">
                                <h4 className="font-bold text-slate-700 text-sm mb-2 border-b border-slate-200 pb-1">{day}</h4>
                                <div className="space-y-2">
                                    {daySchedules.map(sch => (
                                        <div key={sch.id} className="bg-white p-3 rounded shadow-sm border border-slate-100 text-sm">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-emerald-700">{sch.subject}</span>
                                                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{sch.time}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{sch.teacher}</div>
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
    </div>
  );
};
