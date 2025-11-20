import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SpreadsheetTable } from './components/SpreadsheetTable';
import { TeacherTable } from './components/TeacherTable';
import { ScheduleTable } from './components/ScheduleTable';
import { AIAnalyst } from './components/AIAnalyst';
import { Login } from './components/Login';
import { ViewState, Student, User, Teacher, Schedule } from './types';
import { fetchSheetData } from './services/sheetService';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Application Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);

  // Initialize Data from Spreadsheet
  useEffect(() => {
    const initData = async () => {
        setIsLoading(true);
        const data = await fetchSheetData();
        setUsers(data.users);
        setStudents(data.students);
        setTeachers(data.teachers);
        setSchedules(data.schedules);
        setIsLoading(false);
    };

    initData();
  }, []);

  // Reset view when user changes
  useEffect(() => {
      if (user) {
          setView(ViewState.DASHBOARD);
      }
  }, [user]);

  const handleLogout = () => {
      setUser(null);
  };

  // Content Rendering Logic based on Role and ViewState
  const renderContent = () => {
    if (!user) return null;

    switch (currentView) {
      case ViewState.DASHBOARD:
        // Filter data for dashboard if student
        let dashboardData = students;
        if (user.role === 'STUDENT' && user.studentId) {
            dashboardData = students.filter(s => s.id === user.studentId);
        }
        return <Dashboard data={dashboardData} />;
      
      case ViewState.STUDENTS:
        return <SpreadsheetTable data={students} onUpdateData={setStudents} role={user.role} />;
      
      case ViewState.TEACHERS:
        return <TeacherTable data={teachers} onUpdateData={setTeachers} role={user.role} />;
      
      case ViewState.SCHEDULE:
        // Filter schedule based on role
        let displaySchedule = schedules;
        if (user.role === 'STUDENT' && user.studentId) {
             const myData = students.find(s => s.id === user.studentId);
             if (myData) {
                 displaySchedule = schedules.filter(s => s.class === myData.class);
             }
        }
        return <ScheduleTable data={displaySchedule} />;

      case ViewState.MY_GRADES:
         // Reuse SpreadsheetTable but read-only and filtered
         if (user.role === 'STUDENT' && user.studentId) {
             const myData = students.filter(s => s.id === user.studentId);
             return <SpreadsheetTable data={myData} onUpdateData={()=>{}} role={user.role} />;
         }
         return <div>Data tidak ditemukan</div>;

      case ViewState.AI_ANALYST:
        return <AIAnalyst data={students} />;

      default:
        return <Dashboard data={students} />;
    }
  };

  const getTitle = () => {
      switch (currentView) {
          case ViewState.DASHBOARD: return 'Dashboard Utama';
          case ViewState.STUDENTS: return 'Database Siswa';
          case ViewState.TEACHERS: return 'Data Guru & Staf';
          case ViewState.SCHEDULE: return 'Jadwal Pelajaran';
          case ViewState.MY_GRADES: return 'Laporan Hasil Belajar';
          case ViewState.AI_ANALYST: return 'AI Education Analyst';
          default: return 'Smart Ekselensia';
      }
  }

  // --- RENDER LOGIN IF NO USER ---
  if (!user) {
      return <Login users={users} onLogin={setUser} isLoadingData={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        role={user.role} 
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">{getTitle()}</h2>
            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded inline-block mt-0.5">
                        {user.role}
                    </p>
                </div>
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold border-2 border-emerald-100 shadow-sm">
                    {user.avatar ? user.avatar.substring(0,2).toUpperCase() : 'U'}
                </div>
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
             {renderContent()}
        </div>

      </main>
    </div>
  );
};

export default App;
