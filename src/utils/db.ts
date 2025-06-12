// src/utils/db.ts
// Simple localStorage-based database for demo (can be replaced with real backend)

export interface Class {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string; // relasi ke kelas
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  category: string;
  note?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  category: string;
  value: number;
}

const DB_KEY = 'absensi_app_db';

export interface DBData {
  students: Student[];
  attendance: Attendance[];
  grades: Grade[];
  classes: Class[];
}

function getDB(): DBData {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return { students: [], attendance: [], grades: [], classes: [] };
  try {
    const data = JSON.parse(raw);
    // Pastikan field classes ada
    if (!data.classes) data.classes = [];
    return data;
  } catch {
    return { students: [], attendance: [], grades: [], classes: [] };
  }
}

function setDB(data: DBData) {
  // Pastikan field classes ada
  if (!data.classes) data.classes = [];
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

export const db = {
  getStudents: (): Student[] => getDB().students,
  addStudent: (student: Student) => {
    const dbData = getDB();
    dbData.students.push(student);
    setDB(dbData);
  },
  getClasses: (): Class[] => getDB().classes,
  addClass: (kelas: Class) => {
    const dbData = getDB();
    dbData.classes.push(kelas);
    setDB(dbData);
  },
  getAttendance: (): Attendance[] => getDB().attendance,
  addAttendance: (att: Attendance) => {
    const dbData = getDB();
    dbData.attendance.push(att);
    setDB(dbData);
  },
  getGrades: (): Grade[] => getDB().grades,
  addGrade: (grade: Grade) => {
    const dbData = getDB();
    dbData.grades.push(grade);
    setDB(dbData);
  },
  clear: () => setDB({ students: [], attendance: [], grades: [], classes: [] }),
  getOfflineData: (): Attendance[] => getDB().attendance,
  clearOfflineData: () => {
    const dbData = getDB();
    dbData.attendance = [];
    setDB(dbData);
  },
};

// Data dummy kelas untuk testing
export const dummyClasses = [
  { id: 'k1', name: 'X IPA 1' },
  { id: 'k2', name: 'X IPA 2' },
  { id: 'k3', name: 'X IPS 1' },
];

// Data dummy siswa untuk testing
export const dummyStudents = [
  { id: 's1', name: 'Budi Santoso', classId: 'k1' },
  { id: 's2', name: 'Siti Aminah', classId: 'k1' },
  { id: 's3', name: 'Andi Wijaya', classId: 'k2' },
  { id: 's4', name: 'Dewi Lestari', classId: 'k3' },
  { id: 's5', name: 'Rizky Pratama', classId: 'k2' },
];

// Data dummy absensi untuk testing
export const dummyAttendance = [
  { id: 'a1', studentId: 's1', date: '2025-06-09', category: 'hadir', note: '' },
  { id: 'a2', studentId: 's2', date: '2025-06-09', category: 'izin', note: 'Sakit demam' },
  { id: 'a3', studentId: 's3', date: '2025-06-09', category: 'hadir', note: '' },
  { id: 'a4', studentId: 's4', date: '2025-06-09', category: 'alfa', note: 'Tanpa keterangan' },
  { id: 'a5', studentId: 's5', date: '2025-06-09', category: 'sakit', note: 'Sakit flu' },
];

// Data dummy nilai untuk testing
export const dummyGrades = [
  { id: 'g1', studentId: 's1', category: 'Tugas', value: 85 },
  { id: 'g2', studentId: 's2', category: 'Tugas', value: 90 },
  { id: 'g3', studentId: 's3', category: 'Tugas', value: 78 },
  { id: 'g4', studentId: 's4', category: 'Tugas', value: 88 },
  { id: 'g5', studentId: 's5', category: 'Tugas', value: 92 },
];

// Fungsi untuk mengisi database dengan data dummy
export function seedDummyData() {
  setDB({
    students: dummyStudents,
    attendance: dummyAttendance,
    grades: dummyGrades,
    classes: dummyClasses,
  });
}
