import React from 'react';
import { Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Award, AlertTriangle, BookOpen } from 'lucide-react';
import { CHART_COLORS } from '../constants';

interface DashboardProps {
  data: Student[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // 1. Calculations
  const totalStudents = data.length;
  const avgAttendance = Math.round(data.reduce((acc, curr) => acc + curr.attendance, 0) / totalStudents) || 0;
  
  // Calculate avg score across all subjects for each student, then average that
  const avgScore = Math.round(data.reduce((acc, curr) => {
      const studentAvg = (curr.math + curr.science + curr.english + curr.islamicStudies) / 4;
      return acc + studentAvg;
  }, 0) / totalStudents) || 0;

  const atRiskCount = data.filter(s => s.attendance < 85 || ((s.math + s.science + s.english) / 3) < 60).length;

  // 2. Data for Class Distribution (Pie Chart)
  const classDist = data.reduce((acc, curr) => {
      acc[curr.class] = (acc[curr.class] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.keys(classDist).map(cls => ({ name: `Kelas ${cls}`, value: classDist[cls] }));

  // 3. Data for Subject Performance (Bar Chart)
  const subjectAvgs = {
      math: data.reduce((a, c) => a + c.math, 0) / totalStudents,
      science: data.reduce((a, c) => a + c.science, 0) / totalStudents,
      english: data.reduce((a, c) => a + c.english, 0) / totalStudents,
      islamic: data.reduce((a, c) => a + c.islamicStudies, 0) / totalStudents,
  };
  
  const barData = [
      { name: 'Matematika', nilai: Math.round(subjectAvgs.math) },
      { name: 'IPA', nilai: Math.round(subjectAvgs.science) },
      { name: 'B. Inggris', nilai: Math.round(subjectAvgs.english) },
      { name: 'PAI', nilai: Math.round(subjectAvgs.islamic) },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Total Siswa</p>
            <h3 className="text-3xl font-bold text-slate-800">{totalStudents}</h3>
            <p className="text-emerald-600 text-xs font-medium mt-2">+2 bulan ini</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Rata-rata Nilai</p>
            <h3 className="text-3xl font-bold text-slate-800">{avgScore}</h3>
            <p className="text-blue-600 text-xs font-medium mt-2">Target: 85</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Kehadiran</p>
            <h3 className="text-3xl font-bold text-slate-800">{avgAttendance}%</h3>
            <p className="text-slate-400 text-xs font-medium mt-2">7 Hari Terakhir</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">Siswa Berisiko</p>
            <h3 className="text-3xl font-bold text-slate-800">{atRiskCount}</h3>
            <p className="text-red-500 text-xs font-medium mt-2">Butuh Perhatian</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Performa Mata Pelajaran</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="nilai" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Distribusi Siswa per Kelas</h3>
          <div className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};