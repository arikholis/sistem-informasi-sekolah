import { Student, Teacher, Schedule, User } from './types';

// --- Mock Users for Login ---
export const MOCK_USERS: User[] = [
  { username: 'admin', name: 'Administrator', role: 'ADMIN', avatar: 'AD' },
  { username: 'kepsek', name: 'Bpk. Hidayat', role: 'HEADMASTER', avatar: 'KS' },
  { username: 'wakasek', name: 'Ibu Ratna', role: 'VICE_HEADMASTER', avatar: 'WK' },
  { username: 'guru', name: 'Ibu Sarah', role: 'TEACHER', avatar: 'GR' },
  { username: 'siswa', name: 'Ahmad Rizky', role: 'STUDENT', avatar: 'AR', studentId: 'SE-001' },
];

// --- Mock Students ---
export const MOCK_STUDENTS: Student[] = [
  { id: 'SE-001', name: 'Ahmad Rizky', class: 'XA', math: 85, science: 88, english: 78, islamicStudies: 92, attendance: 98, behavior: 'Baik' },
  { id: 'SE-002', name: 'Budi Santoso', class: 'XA', math: 65, science: 70, english: 60, islamicStudies: 80, attendance: 85, behavior: 'Cukup' },
  { id: 'SE-003', name: 'Siti Aminah', class: 'XA', math: 95, science: 92, english: 90, islamicStudies: 95, attendance: 100, behavior: 'Baik' },
  { id: 'SE-004', name: 'Dewi Lestari', class: 'XB', math: 78, science: 82, english: 85, islamicStudies: 88, attendance: 96, behavior: 'Baik' },
  { id: 'SE-005', name: 'Fajar Nugraha', class: 'XB', math: 55, science: 60, english: 58, islamicStudies: 70, attendance: 75, behavior: 'Perlu Bimbingan' },
  { id: 'SE-006', name: 'Gita Pertiwi', class: 'XA', math: 88, science: 85, english: 92, islamicStudies: 89, attendance: 99, behavior: 'Baik' },
  { id: 'SE-007', name: 'Hendra Wijaya', class: 'XC', math: 72, science: 75, english: 70, islamicStudies: 82, attendance: 90, behavior: 'Cukup' },
  { id: 'SE-008', name: 'Indah Sari', class: 'XC', math: 90, science: 91, english: 88, islamicStudies: 94, attendance: 97, behavior: 'Baik' },
  { id: 'SE-009', name: 'Joko Anwar', class: 'XB', math: 68, science: 72, english: 65, islamicStudies: 78, attendance: 88, behavior: 'Cukup' },
  { id: 'SE-010', name: 'Kartika Putri', class: 'XC', math: 92, science: 95, english: 94, islamicStudies: 96, attendance: 100, behavior: 'Baik' },
];

// --- Mock Teachers ---
export const MOCK_TEACHERS: Teacher[] = [
    { id: 'GR-001', nip: '19850101201001', name: 'Ibu Sarah', subject: 'Matematika', classTeacher: 'XA', phone: '08123456789' },
    { id: 'GR-002', nip: '19820505200902', name: 'Bpk. Budi', subject: 'IPA', classTeacher: 'XB', phone: '08129876543' },
    { id: 'GR-003', nip: '19900312201503', name: 'Mrs. Jessica', subject: 'B. Inggris', classTeacher: 'XC', phone: '08135555666' },
    { id: 'GR-004', nip: '19780817200504', name: 'Ust. Abdullah', subject: 'PAI', phone: '08112222333' },
];

// --- Mock Schedules ---
export const MOCK_SCHEDULES: Schedule[] = [
    { id: 'SCH-001', day: 'Senin', time: '07:00 - 08:30', subject: 'Matematika', class: 'XA', teacher: 'Ibu Sarah' },
    { id: 'SCH-002', day: 'Senin', time: '08:30 - 10:00', subject: 'IPA', class: 'XA', teacher: 'Bpk. Budi' },
    { id: 'SCH-003', day: 'Senin', time: '10:30 - 12:00', subject: 'B. Inggris', class: 'XA', teacher: 'Mrs. Jessica' },
    { id: 'SCH-004', day: 'Selasa', time: '07:00 - 08:30', subject: 'PAI', class: 'XA', teacher: 'Ust. Abdullah' },
    { id: 'SCH-005', day: 'Selasa', time: '08:30 - 10:00', subject: 'Matematika', class: 'XB', teacher: 'Ibu Sarah' },
    { id: 'SCH-006', day: 'Rabu', time: '07:00 - 08:30', subject: 'IPA', class: 'XC', teacher: 'Bpk. Budi' },
];

export const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

// Default Spreadsheet URL if needed in the future
export const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3b_J-8.../pub?output=csv"; // Placeholder