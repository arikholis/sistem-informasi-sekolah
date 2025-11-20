import { Student, Teacher, Schedule, User } from '../types';
import { SPREADSHEET_ID } from '../constants';

const BASE_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

// Helper to parse CSV considering quotes
const csvToJSON = (csv: string) => {
  const lines = csv.split(/\r\n|\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
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
      // Simple cleanup and assignment
      const key = h.trim();
      if (values[i] !== undefined) {
         obj[key] = values[i];
      }
    });
    return obj;
  });
};

export const fetchSheetData = async () => {
    console.log("Fetching data from Spreadsheet...");
    try {
        // Fetch all sheets in parallel
        const [usersRes, studentsRes, teachersRes, schedulesRes] = await Promise.allSettled([
            fetch(BASE_URL + 'Akun'),
            fetch(BASE_URL + 'Nilai'),
            fetch(BASE_URL + 'Guru'),
            fetch(BASE_URL + 'Jadwal')
        ]);

        // Initial empty states (No Dummy Data)
        let users: User[] = [];
        let students: Student[] = [];
        let teachers: Teacher[] = [];
        let schedules: Schedule[] = [];

        // Process Users
        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
            const text = await usersRes.value.text();
            const parsed = csvToJSON(text);
            if (parsed.length > 0) users = parsed as User[];
        }

        // Process Students
        if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
            const text = await studentsRes.value.text();
            const parsed = csvToJSON(text);
            if (parsed.length > 0) {
                students = parsed.map((p: any) => ({
                    ...p,
                    math: Number(p.math || 0),
                    science: Number(p.science || 0),
                    english: Number(p.english || 0),
                    islamicStudies: Number(p.islamicStudies || 0),
                    attendance: Number(p.attendance || 0)
                })) as Student[];
            }
        }

        // Process Teachers
        if (teachersRes.status === 'fulfilled' && teachersRes.value.ok) {
            const text = await teachersRes.value.text();
            const parsed = csvToJSON(text);
            if (parsed.length > 0) teachers = parsed as Teacher[];
        }

        // Process Schedules
        if (schedulesRes.status === 'fulfilled' && schedulesRes.value.ok) {
             const text = await schedulesRes.value.text();
             const parsed = csvToJSON(text);
             if (parsed.length > 0) schedules = parsed as Schedule[];
        }

        return { users, students, teachers, schedules };

    } catch (error) {
        console.error("Error fetching spreadsheet:", error);
        // Return empty arrays on error (No Dummy Data)
        return {
            users: [],
            students: [],
            teachers: [],
            schedules: []
        };
    }
}