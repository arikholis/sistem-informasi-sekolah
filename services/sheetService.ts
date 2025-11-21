import { Student, Teacher, Schedule, User } from '../types';
import { SPREADSHEET_ID } from '../constants';

const BASE_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

// Helper to parse CSV considering quotes and normalizing headers
const csvToJSON = (csv: string) => {
  const lines = csv.split(/\r\n|\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  
  // Normalize headers to lowercase to allow case-insensitive matching (e.g. "Username" vs "username")
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));
    
    const obj: any = {};
    headers.forEach((h, i) => {
      if (values[i] !== undefined) {
         // Map known keys to internal naming convention if needed, otherwise use header as key
         obj[h] = values[i];
      }
    });
    return obj;
  });
};

export const fetchSheetData = async () => {
    console.log("Fetching data from Spreadsheet...");
    try {
        // Fetch all sheets in parallel
        // NOTE: Sheet names must match exactly what is in the Google Sheet tabs
        const [usersRes, studentsRes, teachersRes, schedulesRes] = await Promise.allSettled([
            fetch(BASE_URL + 'Akun'),
            fetch(BASE_URL + 'Nilai'),
            fetch(BASE_URL + 'Guru'),
            fetch(BASE_URL + 'Jadwal')
        ]);

        // Initial empty states
        let users: User[] = [];
        let students: Student[] = [];
        let teachers: Teacher[] = [];
        let schedules: Schedule[] = [];

        // Process Users (Sheet: Akun)
        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
            const text = await usersRes.value.text();
            const parsed = csvToJSON(text);
            
            if (parsed.length > 0) {
                users = parsed.map((p: any) => ({
                    username: p.username || p['nama pengguna'], // fallback if indonesia header
                    name: p.name || p.nama,
                    role: (p.role || p.peran || 'STUDENT').toUpperCase(),
                    password: p.password || p.kata_sandi || '123', // Read password column, default 123
                    studentId: p.studentid || p.id_siswa || undefined,
                    avatar: p.avatar || undefined
                })) as User[];
            }
        }

        // Process Students (Sheet: Nilai)
        if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
            const text = await studentsRes.value.text();
            const parsed = csvToJSON(text);
            if (parsed.length > 0) {
                students = parsed.map((p: any) => ({
                    id: p.id,
                    name: p.name || p.nama,
                    class: p.class || p.kelas,
                    math: Number(p.math || p.matematika || 0),
                    science: Number(p.science || p.ipa || 0),
                    english: Number(p.english || p.inggris || p['b. inggris'] || 0),
                    islamicStudies: Number(p.islamicstudies || p.pai || 0),
                    attendance: Number(p.attendance || p.kehadiran || 0),
                    behavior: p.behavior || p.perilaku || 'Baik'
                })) as Student[];
            }
        }

        // Process Teachers (Sheet: Guru)
        if (teachersRes.status === 'fulfilled' && teachersRes.value.ok) {
            const text = await teachersRes.value.text();
            const parsed = csvToJSON(text);
            if (parsed.length > 0) {
                teachers = parsed.map((p: any) => ({
                    id: p.id,
                    nip: p.nip || '-',
                    name: p.name || p.nama,
                    subject: p.subject || p.mapel || p['mata pelajaran'],
                    classTeacher: p.classteacher || p.walikelas || undefined,
                    phone: p.phone || p.telepon || p.hp || '-'
                })) as Teacher[];
            }
        }

        // Process Schedules (Sheet: Jadwal)
        if (schedulesRes.status === 'fulfilled' && schedulesRes.value.ok) {
             const text = await schedulesRes.value.text();
             const parsed = csvToJSON(text);
             if (parsed.length > 0) {
                 schedules = parsed.map((p: any) => ({
                    id: p.id,
                    day: p.day || p.hari,
                    time: p.time || p.waktu || p.jam,
                    subject: p.subject || p.mapel,
                    class: p.class || p.kelas,
                    teacher: p.teacher || p.guru
                 })) as Schedule[];
             }
        }

        return { users, students, teachers, schedules };

    } catch (error) {
        console.error("Error fetching spreadsheet:", error);
        return {
            users: [],
            students: [],
            teachers: [],
            schedules: []
        };
    }
}