import { User, Student, Schedule, Teacher } from '../types';

declare const XLSX: any;

export const parseExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);
                resolve(json);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};

// Mapping Helper: Excel Headers (Bahasa Indonesia) -> Internal Keys
export const mapExcelToUsers = (data: any[]): User[] => {
    return data.map((row: any) => ({
        username: row['Username'] || row['username'],
        name: row['Nama'] || row['name'],
        role: (row['Role'] || row['role']).toUpperCase(),
        password: row['Password'] || row['password'] || '123',
        studentId: row['StudentID'] || row['studentId'] || undefined
    }));
};

export const mapExcelToSchedules = (data: any[]): Schedule[] => {
    return data.map((row: any) => ({
        id: `SCH-${Math.floor(Math.random() * 10000)}`,
        day: row['Hari'] || row['day'],
        time: row['Jam'] || row['time'],
        subject: row['Mapel'] || row['subject'],
        class: row['Kelas'] || row['class'],
        teacher: row['Guru'] || row['teacher']
    }));
};

export const mapExcelToStudents = (data: any[]): Student[] => {
    return data.map((row: any) => ({
        id: row['ID'] || row['id'],
        name: row['Nama'] || row['name'],
        class: row['Kelas'] || row['class'],
        math: Number(row['Matematika'] || row['math'] || 0),
        science: Number(row['IPA'] || row['science'] || 0),
        english: Number(row['Inggris'] || row['english'] || 0),
        islamicStudies: Number(row['PAI'] || row['islamic'] || 0),
        attendance: Number(row['Kehadiran'] || row['attendance'] || 0),
        behavior: row['Perilaku'] || row['behavior'] || 'Baik'
    }));
};