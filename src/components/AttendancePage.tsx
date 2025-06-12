// =============================
// Komponen Halaman Absensi
// Fitur: input absensi siswa per tanggal, edit kategori (hadir, izin, sakit, alfa), dan catatan.
// Mendukung filter tanggal, export ke Excel, dan akses multi-role (admin, guru mapel, wali kelas).
// Kode mudah dipahami, cocok untuk pemula yang ingin belajar absensi berbasis React.
// =============================
// src/components/AttendancePage.tsx
import { useState, useEffect } from 'react';
import { appTheme } from '../utils/auth';
import { type Attendance, type Student } from '../utils/db';
import { dbFirestore } from '../utils/firebase';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import * as XLSX from 'xlsx';

const categories = [
  { value: 'hadir', label: 'Hadir' },
  { value: 'izin', label: 'Izin' },
  { value: 'sakit', label: 'Sakit' },
  { value: 'alfa', label: 'Alfa' },
];

interface AttendancePageProps {
  role: string;
}

const allowedRoles = ['admin', 'subject_teacher', 'homeroom_teacher'];

export default function AttendancePage({ role }: AttendancePageProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [editState, setEditState] = useState<{[id: string]: {category: string, note: string}} | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Ambil data siswa dari Firestore
      const snapStudents = await getDocs(collection(dbFirestore, 'students'));
      const studentsData = snapStudents.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name ?? '',
          classId: d.classId ?? '',
        } as Student;
      });
      setStudents(studentsData);
      // Ambil data absensi dari Firestore untuk tanggal terpilih
      const q = query(collection(dbFirestore, 'attendance'), where('date', '==', selectedDate));
      const snapAttendance = await getDocs(q);
      const attendanceData = snapAttendance.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          studentId: d.studentId ?? '',
          date: d.date ?? '',
          category: d.category ?? '',
          note: d.note ?? '',
        } as Attendance;
      });
      setRecords(attendanceData);
      // Inisialisasi editState jika hari ini dan belum ada absensi
      if (selectedDate === new Date().toISOString().slice(0, 10) && attendanceData.length === 0 && studentsData.length > 0) {
        const initial: {[id: string]: {category: string, note: string}} = {};
        studentsData.forEach(s => {
          initial[s.id] = { category: 'hadir', note: '' };
        });
        setEditState(initial);
      } else {
        setEditState(null);
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedDate]);

  const handleEdit = (studentId: string, field: 'category' | 'note', value: string) => {
    setEditState(prev => ({
      ...(prev || {}),
      [studentId]: {
        category: field === 'category' ? value : prev?.[studentId]?.category || records.find(r => r.studentId === studentId)?.category || 'hadir',
        note: field === 'note' ? value : prev?.[studentId]?.note || records.find(r => r.studentId === studentId)?.note || '',
      }
    }));
  };

  const handleSave = async (studentId: string) => {
    const edit = editState?.[studentId];
    if (!edit) return;
    // Cari record absensi hari ini untuk siswa ini
    const todayRecord = records.find(r => r.studentId === studentId);
    const att = {
      id: todayRecord?.id || studentId + selectedDate,
      studentId,
      date: selectedDate,
      category: edit.category,
      note: edit.note,
    };
    try {
      await setDoc(doc(dbFirestore, 'attendance', att.id), att, { merge: true });
      // Refresh data absensi
      const q = query(collection(dbFirestore, 'attendance'), where('date', '==', selectedDate));
      const snapAttendance = await getDocs(q);
      const attendanceData = snapAttendance.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          studentId: d.studentId ?? '',
          date: d.date ?? '',
          category: d.category ?? '',
          note: d.note ?? '',
        } as Attendance;
      });
      setRecords(attendanceData);
      setEditState(prev => {
        const next = { ...(prev || {}) };
        delete next[studentId];
        return next;
      });
    } catch (e) {
      alert('Gagal menyimpan absensi!');
    }
  };

  // Simpan semua absensi sekaligus
  const handleSaveAll = async () => {
    if (!editState) return;
    try {
      await Promise.all(students.map(async s => {
        const att = {
          id: s.id + selectedDate,
          studentId: s.id,
          date: selectedDate,
          category: editState[s.id]?.category || 'hadir',
          note: editState[s.id]?.note || '',
        };
        await setDoc(doc(dbFirestore, 'attendance', att.id), att, { merge: true });
      }));
      // Refresh data absensi
      const q = query(collection(dbFirestore, 'attendance'), where('date', '==', selectedDate));
      const snapAttendance = await getDocs(q);
      const attendanceData = snapAttendance.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          studentId: d.studentId ?? '',
          date: d.date ?? '',
          category: d.category ?? '',
          note: d.note ?? '',
        } as Attendance;
      });
      setRecords(attendanceData);
      setEditState(null);
    } catch (e) {
      alert('Gagal menyimpan semua absensi!');
    }
  };

  // Reset absensi hari ini
  const handleResetToday = async () => {
    try {
      // Ambil semua dokumen absensi untuk tanggal terpilih
      const q = query(collection(dbFirestore, 'attendance'), where('date', '==', selectedDate));
      const snap = await getDocs(q);
      // Hapus semua dokumen absensi hari ini
      await Promise.all(snap.docs.map(docSnap => deleteDoc(doc(dbFirestore, 'attendance', docSnap.id))));
      setRecords([]);
      setEditState(null);
    } catch (e) {
      alert('Gagal reset absensi hari ini!');
    }
  };

  // Export rekap ke Excel
  const handleExportExcel = () => {
    const data = rekapRecords.map(rec => {
      const student = students.find(s => s.id === rec.studentId);
      return {
        Nama: student ? student.name : '-',
        Kategori: rec.category,
        Catatan: rec.note || '',
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Absensi');
    XLSX.writeFile(wb, `rekap-absensi-${selectedDate}.xlsx`);
  };

  // Filter hanya siswa yang sudah diabsen hari ini untuk rekap
  const rekapRecords = records.filter(r => !!students.find(s => s.id === r.studentId));

  if (!allowedRoles.includes(role)) {
    return (
      <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text, textAlign: 'center' }}>
        <h2 style={{ color: appTheme.primaryColor, marginTop: 0 }}>Akses Ditolak</h2>
        <div style={{ fontSize: 18, marginTop: 16 }}>Anda tidak memiliki akses ke fitur Absensi.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <div style={{
          border: '4px solid #eee',
          borderTop: `4px solid ${appTheme.primaryColor}`,
          borderRadius: '50%',
          width: 48,
          height: 48,
          animation: 'spin 1s linear infinite',
          marginBottom: 16
        }} />
        <div style={{ color: appTheme.primaryColor, fontWeight: 600 }}>Memuat data absensi...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Tombol Simpan Semua hanya muncul jika belum ada absensi hari ini (records.length === 0)
  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text, ...appTheme.glass ? { backdropFilter: 'blur(8px)' } : {} }}>
      <h2 style={{ background: appTheme.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 800, marginTop: 0, marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>Absensi Siswa</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <input type="date" value={selectedDate} max={new Date().toISOString().slice(0, 10)} onChange={e => setSelectedDate(e.target.value)} style={{ padding: 8, borderRadius: 8, border: `1px solid ${appTheme.border}`, fontSize: 16 }} />
      </div>
      {selectedDate === new Date().toISOString().slice(0, 10) && records.length === 0 && editState && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button onClick={handleSaveAll} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Simpan Semua</button>
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <span style={{ fontSize: 18, color: appTheme.primaryColor }}>Memuat data absensi...</span>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.96)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001', marginBottom: 16 }}>
              <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
                <tr>
                  <th style={{ padding: 12, fontWeight: 700 }}>Nama Siswa</th>
                  <th style={{ padding: 12, fontWeight: 700 }}>Keterangan</th>
                  <th style={{ padding: 12, fontWeight: 700 }}>Catatan</th>
                  <th style={{ padding: 12, fontWeight: 700 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const todayRecord = records.find(r => r.studentId === s.id);
                  const edit = editState?.[s.id];
                  return (
                    <tr key={s.id} style={{ borderBottom: `1px solid ${appTheme.border}` }}>
                      <td style={{ padding: 12 }}>{s.name}</td>
                      <td style={{ padding: 12 }}>
                        {categories.map(cat => (
                          <label key={cat.value} style={{ marginRight: 8, fontWeight: 600, color: (edit?.category || todayRecord?.category) === cat.value ? appTheme.primaryColor : appTheme.text }}>
                            <input
                              type="radio"
                              name={`cat-${s.id}`}
                              value={cat.value}
                              checked={(edit?.category || todayRecord?.category) === cat.value}
                              onChange={() => handleEdit(s.id, 'category', cat.value)}
                            /> {cat.label}
                          </label>
                        ))}
                      </td>
                      <td style={{ padding: 12 }}>
                        <input
                          type="text"
                          value={edit?.note ?? todayRecord?.note ?? ''}
                          placeholder="Catatan"
                          style={{ width: 120, padding: 8, borderRadius: 8, border: `1px solid ${appTheme.border}` }}
                          onChange={e => handleEdit(s.id, 'note', e.target.value)}
                        />
                      </td>
                      <td style={{ padding: 12 }}>
                        {editState && edit ? (
                          <button onClick={() => handleSave(s.id)} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>{todayRecord ? 'Ubah' : 'Simpan'}</button>
                        ) : (
                          todayRecord ? '✔️' : ''
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 12 }}>
            <button onClick={handleExportExcel} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Export Rekap Excel</button>
            <button onClick={handleResetToday} style={{ background: '#fff', color: appTheme.primaryColor, border: `1.5px solid ${appTheme.primaryColor}`, borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Reset Absensi Hari Ini</button>
          </div>
          <h3 style={{ color: appTheme.primaryColor, marginTop: 32, marginBottom: 16, fontWeight: 700, textAlign: 'center' }}>Rekap Hari Ini</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.96)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
              <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
                <tr>
                  <th style={{ padding: 12, fontWeight: 700 }}>Nama</th>
                  <th style={{ padding: 12, fontWeight: 700 }}>Kategori</th>
                  <th style={{ padding: 12, fontWeight: 700 }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {rekapRecords.map((rec) => {
                  const student = students.find(s => s.id === rec.studentId);
                  return (
                    <tr key={rec.id} style={{ borderBottom: `1px solid ${appTheme.border}` }}>
                      <td style={{ padding: 12 }}>{student ? student.name : '-'}</td>
                      <td style={{ padding: 12 }}>{rec.category}</td>
                      <td style={{ padding: 12 }}>{rec.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
