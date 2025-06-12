// =============================
// Komponen Import Guru & Jadwal
// Fitur: import data guru, pelajaran, dan jadwal pelajaran dari file Excel.
// Data guru dapat berelasi dengan pelajaran yang diampu dan jadwal kelas.
// =============================

import { db } from '../utils/db';
import { appTheme } from '../utils/auth';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

interface ImportTeacherScheduleProps {
  onImport: (data: any) => void;
}

export default function ImportTeacherSchedule({ onImport }: ImportTeacherScheduleProps) {
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
      // Asumsi baris pertama header: Nama Guru, Mata Pelajaran, Kelas, Hari, Jam
      const imported = json.slice(1).map(row => ({
        teacher: row[0] || '',
        subject: row[1] || '',
        className: row[2] || '',
        day: row[3] || '',
        time: row[4] || ''
      })).filter(d => d.teacher && d.subject && d.className);
      // Simpan ke db
      imported.forEach(row => {
        // Cek/tambah guru
        let teacher = db.getTeachers().find(t => t.name === row.teacher);
        if (!teacher) {
          teacher = { id: 't' + Date.now() + Math.random(), name: row.teacher };
          db.addTeacher(teacher);
        }
        // Cek/tambah pelajaran
        let subject = db.getSubjects().find(s => s.name === row.subject);
        if (!subject) {
          subject = { id: 'sub' + Date.now() + Math.random(), name: row.subject };
          db.addSubject(subject);
        }
        // Cek/tambah kelas
        let classObj = db.getClasses().find(c => c.name === row.className);
        if (!classObj) {
          classObj = { id: 'k' + Date.now() + Math.random(), name: row.className };
          db.addClass(classObj);
        }
        // Tambah jadwal
        db.addSchedule({
          id: 'sch' + Date.now() + Math.random(),
          teacherId: teacher.id,
          subjectId: subject.id,
          classId: classObj.id,
          day: row.day,
          time: row.time
        });
      });
      setUploadMessage('File berhasil diupload dan data guru/jadwal diimpor!');
      onImport(imported);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ margin: '24px 0', padding: 16, background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}` }}>
      <h3 style={{ color: appTheme.primary, marginTop: 0 }}>Import Data Guru & Jadwal (Excel)</h3>
      <a
        href="/template_import_guru_jadwal.xlsx"
        download
        style={{
          display: 'inline-block',
          marginBottom: 12,
          background: appTheme.primaryColor,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 15,
          textDecoration: 'none',
          boxShadow: '0 1px 4px #0001',
          cursor: 'pointer',
        }}
      >
        Download Template Excel
      </a>
      <br />
      <label style={{ display: 'inline-block', marginBottom: 12 }}>
        <span style={{
          background: appTheme.primaryColor,
          color: '#fff',
          borderRadius: 8,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          boxShadow: '0 1px 4px #0001',
          border: 'none',
          marginRight: 8,
        }}>
          Upload File Excel
          <input type="file" accept=".xlsx,.xls" ref={fileInput} onChange={handleFile} style={{ display: 'none' }} />
        </span>
      </label>
      {uploadMessage && (
        <div style={{ color: 'green', fontWeight: 600, marginBottom: 8 }}>{uploadMessage}</div>
      )}
      <div style={{ color: '#888', fontSize: 13 }}>
        Format: Kolom: Nama Guru, Mata Pelajaran, Kelas, Hari, Jam. File Excel harus berekstensi .xlsx atau .xls
      </div>
    </div>
  );
}
