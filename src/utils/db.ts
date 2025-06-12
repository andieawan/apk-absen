// =============================
// Database Lokal Sederhana (utils/db.ts)
// Berisi struktur data, dummy data, dan fungsi CRUD untuk siswa, kelas, absensi, dan nilai.
// Cocok untuk belajar konsep database sederhana di aplikasi web.
// Mudah dikembangkan untuk backend sungguhan.
// =============================

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

export interface Teacher {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Schedule {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  day: string;
  time: string;
}

const DB_KEY = 'absensi_app_db';

export interface DBData {
  students: Student[];
  attendance: Attendance[];
  grades: Grade[];
  classes: Class[];
  teachers: Teacher[];
  subjects: Subject[];
  schedules: Schedule[];
}

function getDB(): DBData {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return { students: [], attendance: [], grades: [], classes: [], teachers: [], subjects: [], schedules: [] };
  try {
    const data = JSON.parse(raw);
    // Pastikan field classes ada
    if (!data.classes) data.classes = [];
    if (!data.teachers) data.teachers = [];
    if (!data.subjects) data.subjects = [];
    if (!data.schedules) data.schedules = [];
    return data;
  } catch {
    return { students: [], attendance: [], grades: [], classes: [], teachers: [], subjects: [], schedules: [] };
  }
}

function setDB(data: DBData) {
  // Pastikan field classes ada
  if (!data.classes) data.classes = [];
  if (!data.teachers) data.teachers = [];
  if (!data.subjects) data.subjects = [];
  if (!data.schedules) data.schedules = [];
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
  getTeachers: (): Teacher[] => getDB().teachers,
  addTeacher: (teacher: Teacher) => {
    const dbData = getDB();
    dbData.teachers.push(teacher);
    setDB(dbData);
  },
  getSubjects: (): Subject[] => getDB().subjects,
  addSubject: (subject: Subject) => {
    const dbData = getDB();
    dbData.subjects.push(subject);
    setDB(dbData);
  },
  getSchedules: (): Schedule[] => getDB().schedules,
  addSchedule: (schedule: Schedule) => {
    const dbData = getDB();
    dbData.schedules.push(schedule);
    setDB(dbData);
  },
  clear: () => setDB({ students: [], attendance: [], grades: [], classes: [], teachers: [], subjects: [], schedules: [] }),
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

// Data dummy guru untuk testing
export const dummyTeachers = [
  { id: 't1', name: 'Guru Besar' },
  { id: 't2', name: 'Dra. Siti' },
  { id: 't3', name: 'Mr. John' },
];

// Data dummy pelajaran untuk testing
export const dummySubjects = [
  { id: 'sub1', name: 'Matematika' },
  { id: 'sub2', name: 'Bahasa Indonesia' },
  { id: 'sub3', name: 'Fisika' },
];

// Data dummy jadwal untuk testing
export const dummySchedules = [
  { id: 'j1', teacherId: 't1', subjectId: 'sub1', classId: 'k1', day: 'Senin', time: '08:00' },
  { id: 'j2', teacherId: 't2', subjectId: 'sub2', classId: 'k1', day: 'Senin', time: '10:00' },
  { id: 'j3', teacherId: 't3', subjectId: 'sub3', classId: 'k2', day: 'Selasa', time: '08:00' },
];

// Fungsi untuk mengisi database dengan data dummy
export function seedDummyData() {
  setDB({
    students: dummyStudents,
    attendance: dummyAttendance,
    grades: dummyGrades,
    classes: dummyClasses,
    teachers: dummyTeachers,
    subjects: dummySubjects,
    schedules: dummySchedules,
  });
}
