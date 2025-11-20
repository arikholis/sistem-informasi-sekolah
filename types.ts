export type UserRole = 'ADMIN' | 'HEADMASTER' | 'VICE_HEADMASTER' | 'TEACHER' | 'STUDENT';

export interface User {
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
  studentId?: string; // Jika role adalah STUDENT
}

export interface Student {
  id: string;
  name: string;
  class: string;
  math: number;
  science: number;
  english: number;
  islamicStudies: number;
  attendance: number;
  behavior: 'Baik' | 'Cukup' | 'Perlu Bimbingan';
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  subject: string;
  classTeacher?: string; // Wali kelas
  phone: string;
}

export interface Schedule {
  id: string;
  day: string;
  time: string;
  subject: string;
  class: string;
  teacher: string;
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  atRiskStudents: string[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS', // Ganti DATABASE jadi STUDENTS
  TEACHERS = 'TEACHERS',
  SCHEDULE = 'SCHEDULE',
  MY_GRADES = 'MY_GRADES', // Khusus Siswa
  AI_ANALYST = 'AI_ANALYST'
}