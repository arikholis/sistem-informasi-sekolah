import { Student, Teacher, Schedule, User } from './types';

// --- Spreadsheet Configuration ---
// Link View: https://docs.google.com/spreadsheets/d/1YVZh5YvPL2piYOaMjucCS6-XREJHT65KxFlHZkTiUqI
export const SPREADSHEET_ID = "1YVZh5YvPL2piYOaMjucCS6-XREJHT65KxFlHZkTiUqI";

// --- Google Apps Script Web App URL ---
// URL ini digunakan untuk mengirim data (POST) kembali ke spreadsheet
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXQsy4O6K8hbgPRExmgB2ljfJFCiOFytDmN4sou9K4-SXfcR7iG6thhRqH641gixHr2A/exec"; 

// --- Mock Users (Empty - Real data comes from Spreadsheet) ---
export const MOCK_USERS: User[] = [];

// --- Mock Students (Empty) ---
export const MOCK_STUDENTS: Student[] = [];

// --- Mock Teachers (Empty) ---
export const MOCK_TEACHERS: Teacher[] = [];

// --- Mock Schedules (Empty) ---
export const MOCK_SCHEDULES: Schedule[] = [];

export const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];