// =============================
// Komponen Data Jadwal Pelajaran
// Menampilkan jadwal pelajaran per kelas, guru, dan pelajaran.
// =============================
import { db } from '../utils/db';
import { appTheme } from '../utils/auth';
import * as XLSX from 'xlsx';

export default function SchedulePage() {
  const schedules = db.getSchedules();
  const teachers = db.getTeachers();
  const subjects = db.getSubjects();
  const classes = db.getClasses();
  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text }}>
      <h2 style={{ color: appTheme.primaryColor, marginTop: 0, marginBottom: 24, textAlign: 'center', fontWeight: 800 }}>Jadwal Pelajaran</h2>
      <button
        onClick={() => {
          // Export jadwal ke Excel
          const data = [
            ['Kelas', 'Hari', 'Jam', 'Mata Pelajaran', 'Guru']
          ];
          schedules.forEach(sch => {
            const kelas = classes.find(k => k.id === sch.classId);
            const guru = teachers.find(t => t.id === sch.teacherId);
            const pelajaran = subjects.find(s => s.id === sch.subjectId);
            data.push([
              kelas ? kelas.name : '-',
              sch.day,
              sch.time,
              pelajaran ? pelajaran.name : '-',
              guru ? guru.name : '-'
            ]);
          });
          const ws = XLSX.utils.aoa_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Jadwal');
          XLSX.writeFile(wb, 'jadwal_pelajaran.xlsx');
        }}
        style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #0001', marginBottom: 18 }}
      >
        Export Jadwal (Excel)
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.96)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
        <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
          <tr>
            <th style={{ padding: 12, fontWeight: 700 }}>No</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Kelas</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Hari</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Jam</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Mata Pelajaran</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Guru</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Belum ada data jadwal.</td></tr>
          ) : schedules.map((sch, idx) => {
            const kelas = classes.find(k => k.id === sch.classId);
            const guru = teachers.find(t => t.id === sch.teacherId);
            const pelajaran = subjects.find(s => s.id === sch.subjectId);
            return (
              <tr key={sch.id} style={{ borderBottom: `1px solid ${appTheme.border}` }}>
                <td style={{ padding: 12 }}>{idx + 1}</td>
                <td style={{ padding: 12 }}>{kelas ? kelas.name : '-'}</td>
                <td style={{ padding: 12 }}>{sch.day}</td>
                <td style={{ padding: 12 }}>{sch.time}</td>
                <td style={{ padding: 12 }}>{pelajaran ? pelajaran.name : '-'}</td>
                <td style={{ padding: 12 }}>{guru ? guru.name : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
