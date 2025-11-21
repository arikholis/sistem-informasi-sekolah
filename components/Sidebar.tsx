import React from 'react';
import { ViewState, UserRole } from '../types';
import { LayoutDashboard, Users, GraduationCap, CalendarDays, BookOpen, LogOut, Sparkles, UserCog, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  role: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, role, onLogout }) => {
  
  const getNavItems = () => {
    const items = [
      { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HEADMASTER', 'VICE_HEADMASTER', 'TEACHER', 'STUDENT'] },
      { id: ViewState.USER_MANAGEMENT, label: 'Manajemen Akun', icon: UserCog, roles: ['ADMIN', 'HEADMASTER', 'VICE_HEADMASTER'] },
      { id: ViewState.STUDENTS, label: 'Data Siswa & Nilai', icon: GraduationCap, roles: ['ADMIN', 'HEADMASTER', 'VICE_HEADMASTER', 'TEACHER'] },
      { id: ViewState.TEACHERS, label: 'Data Guru', icon: Users, roles: ['ADMIN', 'HEADMASTER', 'VICE_HEADMASTER'] },
      { id: ViewState.SCHEDULE, label: 'Jadwal Pelajaran', icon: CalendarDays, roles: ['ADMIN', 'HEADMASTER', 'VICE_HEADMASTER', 'TEACHER', 'STUDENT'] },
      { id: ViewState.MY_GRADES, label: 'Nilai Saya', icon: BookOpen, roles: ['STUDENT'] },
      { id: ViewState.AI_ANALYST, label: 'Analisis Data', icon: Sparkles, roles: ['ADMIN', 'HEADMASTER', 'VICE_HEADMASTER'] },
    ];

    return items.filter(item => item.roles.includes(role));
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-emerald-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
        <div className="bg-white p-2 rounded-full shadow-lg">
             <div className="w-6 h-6 bg-emerald-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">SE</span>
             </div>
        </div>
        <div>
            <h1 className="font-bold text-lg leading-tight">Smart Ekselensia</h1>
            <p className="text-xs text-emerald-300">Database System</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                ? 'bg-emerald-700 text-white shadow-lg translate-x-1 border-l-4 border-emerald-300' 
                : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-emerald-800 space-y-2">
        <button 
            onClick={() => setView(ViewState.SETTINGS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === ViewState.SETTINGS ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:text-white hover:bg-emerald-800'
            }`}
        >
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
        </button>

        <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-900/30 hover:text-red-100 transition-all"
        >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};