import { Student, Teacher, Schedule, User } from '../types';
import { SPREADSHEET_ID, GOOGLE_SCRIPT_URL } from '../constants';

const BASE_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

// Helper to parse CSV
const csvToJSON = (csv: string) => {
  const lines = csv.split(/\r\n|\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  
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
         obj[h] = values[i];
      }
    });
    return obj;
  });
};

export const fetchSheetData = async () => {
    console.log("Fetching data from Spreadsheet...");
    try {
        const [usersRes, studentsRes, teachersRes, schedulesRes] = await Promise.allSettled([
            fetch(BASE_URL + 'Akun'),
            fetch(BASE_URL + 'Nilai'),
            fetch(BASE_URL + 'Guru'),
            fetch(BASE_URL + 'Jadwal')
        ]);

        let users: User[] = [];
        let students: Student[] = [];
        let teachers: Teacher[] = [];
        let schedules: Schedule[] = [];

        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
            const text = await usersRes.value.text();
            const parsed = csvToJSON(text);
            if (parsed.length > 0) {
                users = parsed.map((p: any) => ({
                    username: p.username,
                    name: p.name,
                    role: (p.role || 'STUDENT').toUpperCase(),
                    password: p.password || '123',
                    studentId: p.studentid,
                    avatar: p.avatar
                })) as User[];
            }
        }

        if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
            const text = await studentsRes.value.text();
            const parsed = csvToJSON(text);
            if (parsed.length > 0) {
                students = parsed.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    class: p.class,
                    math: Number(p.math || 0),
                    science: Number(p.science || 0),
                    english: Number(p.english || 0),
                    islamicStudies: Number(p.islamicstudies || 0),
                    attendance: Number(p.attendance || 0),
                    behavior: p.behavior || 'Baik'
                })) as Student[];
            }
        }

        if (teachersRes.status === 'fulfilled' && teachersRes.value.ok) {
            const text = await teachersRes.value.text();
            const parsed = csvToJSON(text);
            if (parsed.length > 0) {
                teachers = parsed.map((p: any) => ({
                    id: p.id,
                    nip: p.nip || '-',
                    name: p.name,
                    subject: p.subject,
                    classTeacher: p.classteacher,
                    phone: p.phone || '-'
                })) as Teacher[];
            }
        }

        if (schedulesRes.status === 'fulfilled' && schedulesRes.value.ok) {
             const text = await schedulesRes.value.text();
             const parsed = csvToJSON(text);
             if (parsed.length > 0) {
                 schedules = parsed.map((p: any) => ({
                    id: p.id,
                    day: p.day,
                    time: p.time,
                    subject: p.subject,
                    class: p.class,
                    teacher: p.teacher
                 })) as Schedule[];
             }
        }

        return { users, students, teachers, schedules };

    } catch (error) {
        console.error("Error fetching spreadsheet:", error);
        return { users: [], students: [], teachers: [], schedules: [] };
    }
};

// --- SAVING DATA ---

export const saveSheetData = async (sheetName: 'Akun' | 'Nilai' | 'Guru' | 'Jadwal', data: any[]) => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('xxxxxxxx')) {
        console.warn("Google Apps Script URL belum dikonfigurasi di constants.ts. Data tidak akan tersimpan di cloud.");
        return;
    }

    console.log(`Saving ${sheetName} to cloud...`);

    // Format data to 2D Array [Header, ...Rows]
    let rows: any[][] = [];

    if (sheetName === 'Akun') {
        rows.push(['username', 'password', 'name', 'role', 'studentId']); // Header
        rows.push(...data.map((u: User) => [
            u.username, 
            u.password || '123', 
            u.name, 
            u.role, 
            u.studentId || ''
        ]));
    } else if (sheetName === 'Nilai') {
        rows.push(['id', 'name', 'class', 'math', 'science', 'english', 'islamicStudies', 'attendance', 'behavior']);
        rows.push(...data.map((s: Student) => [
            s.id, s.name, s.class, s.math, s.science, s.english, s.islamicStudies, s.attendance, s.behavior
        ]));
    } else if (sheetName === 'Guru') {
        rows.push(['id', 'nip', 'name', 'subject', 'classTeacher', 'phone']);
        rows.push(...data.map((t: Teacher) => [
            t.id, t.nip, t.name, t.subject, t.classTeacher || '', t.phone
        ]));
    } else if (sheetName === 'Jadwal') {
        rows.push(['id', 'day', 'time', 'subject', 'class', 'teacher']);
        rows.push(...data.map((sc: Schedule) => [
            sc.id, sc.day, sc.time, sc.subject, sc.class, sc.teacher
        ]));
    }

    try {
        // Send to Google Apps Script
        // mode: 'no-cors' is needed because Google Redirects don't fully support standard CORS preflight in simple web apps
        // This means we won't get a readable response, but the action will execute.
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheet: sheetName, data: rows })
        });
        console.log(`${sheetName} saved successfully (Request Sent).`);
    } catch (error) {
        console.error(`Failed to save ${sheetName}:`, error);
        alert(`Gagal menyimpan data ${sheetName} ke server.`);
    }
};