import { useState } from 'react';
import { db } from '../utils/db';
import { appTheme } from '../utils/auth';
import * as XLSX from 'xlsx';

export default function ClassPage() {
  const [classes, setClasses] = useState(() => db.getClasses());
  const [newClass, setNewClass] = useState('');
  const [editId, setEditId] = useState<string|null>(null);
  const [editName, setEditName] = useState('');
  const [selectedClass, setSelectedClass] = useState<string|null>(null);

  const handleAdd = () => {
    if (!newClass.trim()) return;
    const id = 'k' + (classes.length + 1);
    db.addClass({ id, name: newClass });
    setClasses(db.getClasses());
    setNewClass('');
  };

  const handleEdit = (id: string, name: string) => {
    setEditId(id);
    setEditName(name);
  };

  const handleEditSave = () => {
    if (!editId || !editName.trim()) return;
    // update in db
    const dbClasses = db.getClasses().map(k => k.id === editId ? { ...k, name: editName } : k);
    db.clear();
    dbClasses.forEach(k => db.addClass(k));
    db.getStudents().forEach(s => db.addStudent(s));
    setClasses(db.getClasses());
    setEditId(null);
    setEditName('');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus kelas ini?')) return;
    const dbClasses = db.getClasses().filter(k => k.id !== id);
    db.clear();
    dbClasses.forEach(k => db.addClass(k));
    db.getStudents().forEach(s => db.addStudent(s));
    setClasses(db.getClasses());
    if (selectedClass === id) setSelectedClass(null);
  };

  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text }}>
      <h2 style={{ color: appTheme.primaryColor, marginTop: 0, marginBottom: 24, textAlign: 'center', fontWeight: 800 }}>Data Kelas</h2>
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="text"
          value={newClass}
          onChange={e => setNewClass(e.target.value)}
          placeholder="Nama kelas baru"
          style={{ padding: 10, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16, minWidth: 180 }}
        />
        <button
          onClick={handleAdd}
          style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}
        >
          Tambah Kelas
        </button>
        <button
          onClick={() => {
            const classes = db.getClasses();
            const students = db.getStudents();
            const data = [['Nama Kelas', 'Nama Siswa']];
            classes.forEach(k => {
              const siswaKelas = students.filter(s => s.classId === k.id);
              if (siswaKelas.length === 0) {
                data.push([k.name, '']);
              } else {
                siswaKelas.forEach(s => data.push([k.name, s.name]));
              }
            });
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Kelas & Siswa');
            XLSX.writeFile(wb, 'data_kelas_dan_siswa.xlsx');
          }}
          style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}
        >
          Export Kelas & Siswa (Excel)
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.96)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
        <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
          <tr>
            <th style={{ padding: 12, fontWeight: 700 }}>No</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Nama Kelas</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Belum ada data kelas.</td></tr>
          ) : classes.map((kelas, idx) => (
            <tr key={kelas.id} style={{ borderBottom: `1px solid ${appTheme.border}` }}>
              <td style={{ padding: 12 }}>{idx + 1}</td>
              <td style={{ padding: 12, cursor: 'pointer', color: appTheme.primaryColor, textDecoration: 'underline' }} onClick={() => setSelectedClass(kelas.id)}>{editId === kelas.id ? (
                <input value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${appTheme.border}` }} />
              ) : kelas.name}</td>
              <td style={{ padding: 12 }}>
                {editId === kelas.id ? (
                  <>
                    <button onClick={handleEditSave} style={{ marginRight: 8, background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Simpan</button>
                    <button onClick={() => setEditId(null)} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(kelas.id, kelas.name)} style={{ marginRight: 8, background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(kelas.id)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Hapus</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Daftar siswa per kelas */}
      {selectedClass && (
        <div style={{ marginTop: 32, background: '#f4f6fb', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px #0001', border: `1px solid ${appTheme.border}` }}>
          <h3 style={{ color: appTheme.primaryColor, marginTop: 0 }}>Daftar Siswa Kelas {classes.find(k => k.id === selectedClass)?.name}</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {db.getStudents().filter(s => s.classId === selectedClass).length === 0 ? (
              <li style={{ color: '#888' }}>Belum ada siswa di kelas ini.</li>
            ) : db.getStudents().filter(s => s.classId === selectedClass).map(s => (
              <li key={s.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>{s.name}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedClass(null)} style={{ marginTop: 16, background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>Tutup</button>
        </div>
      )}
    </div>
  );
}
