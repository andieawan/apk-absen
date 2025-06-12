// =============================
// Komponen Data Siswa
// Halaman ini menampilkan daftar siswa beserta kelasnya.
// Fitur: filter berdasarkan kelas dan export data siswa ke Excel.
// Kode ini mudah dipahami dan dimodifikasi, cocok untuk pemula yang ingin belajar React + TypeScript.
// Untuk menambah/mengedit fitur, cukup modifikasi bagian return atau tambahkan fungsi baru sesuai kebutuhan.
// =============================

import { useState } from 'react';
import { db } from '../utils/db';
import { appTheme } from '../utils/auth';
import * as XLSX from 'xlsx';

export default function StudentPage() {
  // Ambil data siswa dan kelas dari database lokal
  const students = db.getStudents();
  const classes = db.getClasses();
  // State untuk filter kelas
  const [selectedClass, setSelectedClass] = useState('');

  // Filter siswa berdasarkan kelas yang dipilih
  const filteredStudents = selectedClass ? students.filter(s => s.classId === selectedClass) : students;

  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text }}>
      <h2 style={{ color: appTheme.primaryColor, marginTop: 0, marginBottom: 24, textAlign: 'center', fontWeight: 800 }}>Data Siswa</h2>
      {/* Filter kelas untuk memudahkan pencarian siswa */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <label style={{ fontWeight: 600, color: appTheme.text }}>
          Filter Kelas:
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ marginLeft: 8, padding: 8, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }}>
            <option value="">Semua</option>
            {classes.map(k => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        </label>
        {/* Tombol export data siswa ke Excel */}
        <button
          onClick={() => {
            // Data yang diexport: Nama Siswa dan Kelas
            const data = [['Nama Siswa', 'Kelas']];
            filteredStudents.forEach(s => {
              data.push([s.name, classes.find(k => k.id === s.classId)?.name || '-']);
            });
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
            XLSX.writeFile(wb, 'data_siswa.xlsx');
          }}
          style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}
        >
          Export Data Siswa (Excel)
        </button>
      </div>
      {/* Tabel data siswa */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.96)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
        <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
          <tr>
            <th style={{ padding: 12, fontWeight: 700 }}>No</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Nama Siswa</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Kelas</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Belum ada data siswa.</td></tr>
          ) : filteredStudents.map((s, idx) => (
            <tr key={s.id} style={{ borderBottom: `1px solid ${appTheme.border}` }}>
              <td style={{ padding: 12 }}>{idx + 1}</td>
              <td style={{ padding: 12 }}>{s.name}</td>
              <td style={{ padding: 12 }}>{classes.find(k => k.id === s.classId)?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
