// =============================
// Komponen Data Guru (TeacherPage)
// =============================
// Fitur:
// - Menampilkan daftar guru, pelajaran yang diampu, dan jadwal mengajar per guru.
// - Guru yang sedang login (bukan admin) dapat mengedit profil sendiri (nama & password) melalui form di bagian atas.
// - Validasi nama tidak boleh kosong, password minimal 4 karakter jika diisi.
// - Notifikasi sukses/gagal update profil.
// - Admin hanya dapat melihat & mengedit data guru lain melalui tabel.
// - Data guru dapat diexport ke Excel.
//
// Props:
//   username: string  // Username user yang sedang login
//   role: string      // Role user yang sedang login (admin, subject_teacher, homeroom_teacher, counselor)
//
// Catatan:
// - Untuk pengembangan lebih lanjut, update profil sebaiknya terhubung ke backend/server.
// - Komponen ini mobile-friendly dan mudah dikembangkan.
// =============================
import { appTheme } from '../utils/auth';
import * as XLSX from 'xlsx';
import { useState, useEffect } from 'react';
import { dbFirestore } from '../utils/firebase';
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  setDoc,
} from 'firebase/firestore';

interface TeacherPageProps {
  username: string;
  role: string;
}

/**
 * Komponen Data Guru
 * - Menampilkan daftar guru, pelajaran, dan jadwal
 * - Guru yang sedang login dapat mengedit profil sendiri (nama & password)
 * - Admin hanya bisa melihat & mengedit data guru lain
 */
export default function TeacherPage({ username, role }: TeacherPageProps) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [editId, setEditId] = useState<string|null>(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [notif, setNotif] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil data guru, pelajaran, jadwal, kelas dari Firestore
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const snapTeachers = await getDocs(collection(dbFirestore, 'teachers'));
      setTeachers(snapTeachers.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const snapSubjects = await getDocs(collection(dbFirestore, 'subjects'));
      setSubjects(snapSubjects.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const snapSchedules = await getDocs(collection(dbFirestore, 'schedules'));
      setSchedules(snapSchedules.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const snapClasses = await getDocs(collection(dbFirestore, 'classes'));
      setClasses(snapClasses.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Simpan perubahan ke Firestore
  const handleEditSave = async () => {
    if (!editId || !editName.trim()) {
      setNotif('Nama tidak boleh kosong!');
      return;
    }
    // Validasi username unik (khusus admin, jika mengubah username)
    if (role === 'admin' && editId !== prevEditId) {
      const q = query(collection(dbFirestore, 'teachers'), where('__name__', '==', editId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setNotif('Username sudah digunakan guru lain!');
        return;
      }
    }
    if (editPassword && editPassword.length < 4) {
      setNotif('Password minimal 4 karakter!');
      return;
    }
    // Update guru di Firestore
    try {
      const updateData: any = { name: editName };
      if (editPassword) updateData.password = editPassword;
      await setDoc(doc(dbFirestore, 'teachers', editId), updateData, { merge: true });
      setNotif('Data guru berhasil diupdate!');
      setEditId(null);
      setEditName('');
      setEditPassword('');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e) {
      setNotif('Gagal update data guru!');
    }
  };

  // Fungsi untuk mulai edit (admin/guru)
  const [prevEditId, setPrevEditId] = useState<string|null>(null);
  const handleEdit = (id: string, name: string) => {
    setEditId(id);
    setPrevEditId(id);
    setEditName(name);
    setEditPassword('');
    setNotif(null);
  };

  // Hanya guru yang sedang login bisa edit profil sendiri
  const canEditProfile = role !== 'admin';
  const myTeacher = teachers.find(t => t.id === username);

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
        <div style={{ color: appTheme.primaryColor, fontWeight: 600 }}>Memuat data guru...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 32, marginTop: 16, color: appTheme.text }}>
      <h2 style={{ color: appTheme.primaryColor, marginTop: 0, marginBottom: 24, textAlign: 'center', fontWeight: 800 }}>Data Guru</h2>
      {/* Form edit profil guru (hanya untuk guru yang login) */}
      {canEditProfile && myTeacher && (
        <div style={{ marginBottom: 32, background: '#f7f8fd', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px #0001', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: appTheme.primaryColor }}>Edit Profil Saya</div>
          <div style={{ marginBottom: 8 }}>
            <label>Nama:</label><br />
            <input value={editId === myTeacher.id ? editName : myTeacher.name} onChange={e => { setEditId(myTeacher.id); setEditName(e.target.value); }} style={{ padding: 6, borderRadius: 6, border: `1px solid ${appTheme.border}`, width: '100%' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Password baru (opsional):</label><br />
            <input type="password" value={editId === myTeacher.id ? editPassword : ''} onChange={e => { setEditId(myTeacher.id); setEditPassword(e.target.value); }} style={{ padding: 6, borderRadius: 6, border: `1px solid ${appTheme.border}`, width: '100%' }} />
          </div>
          <button onClick={handleEditSave} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Simpan</button>
          {editId && (
            <button onClick={() => { setEditId(null); setEditName(myTeacher.name); setEditPassword(''); setNotif(null); }} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
          )}
          {notif && <div style={{ marginTop: 10, color: notif.includes('berhasil') ? 'green' : 'red', fontWeight: 500 }}>{notif}</div>}
        </div>
      )}
      {/* Form edit data guru (khusus admin) */}
      {role === 'admin' && editId && (
        <div style={{ marginBottom: 32, background: '#f7f8fd', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px #0001', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: appTheme.primaryColor }}>Edit Data Guru</div>
          <div style={{ marginBottom: 8 }}>
            <label>Nama Guru:</label><br />
            <input value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${appTheme.border}`, width: '100%' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Username:</label><br />
            <input value={editId} onChange={e => {
              const newUsername = e.target.value.trim();
              // Cek username sudah dipakai guru lain?
              if (teachers.some(t => t.id === newUsername && newUsername !== editId)) {
                setNotif('Username sudah digunakan guru lain!');
              } else {
                setNotif(null);
                setEditId(newUsername);
              }
            }} style={{ padding: 6, borderRadius: 6, border: `1px solid ${appTheme.border}`, width: '100%' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Password baru (opsional):</label><br />
            <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${appTheme.border}`, width: '100%' }} />
          </div>
          <button onClick={handleEditSave} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }} disabled={notif !== null}>Simpan</button>
          <button onClick={() => { setEditId(null); setEditName(''); setEditPassword(''); setNotif(null); }} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
          {notif && <div style={{ marginTop: 10, color: 'red', fontWeight: 500 }}>{notif}</div>}
        </div>
      )}
      <button
        onClick={() => {
          // Export data guru ke Excel
          const data = [
            ['Nama Guru', 'Pelajaran Diampu', 'Jadwal Mengajar']
          ];
          teachers.forEach(guru => {
            const pelajaran = schedules.filter(sch => sch.teacherId === guru.id).map(sch => {
              const subj = subjects.find(sub => sub.id === sch.subjectId);
              return subj ? subj.name : '-';
            });
            const jadwal = schedules.filter(sch => sch.teacherId === guru.id).map(sch => {
              const kelas = classes.find(k => k.id === sch.classId);
              const subj = subjects.find(sub => sub.id === sch.subjectId);
              return `${sch.day}, ${sch.time} - ${subj ? subj.name : '-'} (${kelas ? kelas.name : '-'})`;
            });
            data.push([
              guru.name,
              pelajaran.length > 0 ? pelajaran.join(', ') : '-',
              jadwal.length > 0 ? jadwal.join(' | ') : '-'
            ]);
          });
          const ws = XLSX.utils.aoa_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Data Guru');
          XLSX.writeFile(wb, 'data_guru.xlsx');
        }}
        style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px #0001', marginBottom: 18 }}
      >
        Export Data Guru (Excel)
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.96)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
        <thead style={{ background: appTheme.primaryColor, color: '#fff' }}>
          <tr>
            <th style={{ padding: 12, fontWeight: 700 }}>No</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Nama Guru</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Username</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Password</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Role</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Pelajaran Diampu</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Wali Kelas</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Jadwal Mengajar</th>
            <th style={{ padding: 12, fontWeight: 700 }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length === 0 ? (
            <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24, color: '#888' }}>Belum ada data guru.</td></tr>
          ) : teachers.map((guru, idx) => {
            // Cari pelajaran yang diampu dari jadwal
            const pelajaran = schedules.filter(sch => sch.teacherId === guru.id).map(sch => {
              const subj = subjects.find(sub => sub.id === sch.subjectId);
              return subj ? subj.name : '-';
            });
            // Jadwal mengajar
            const jadwal = schedules.filter(sch => sch.teacherId === guru.id).map(sch => {
              const kelas = classes.find(k => k.id === sch.classId);
              const subj = subjects.find(sub => sub.id === sch.subjectId);
              return `${sch.day}, ${sch.time} - ${subj ? subj.name : '-'} (${kelas ? kelas.name : '-'})`;
            });
            // Ambil data user (username, password, role) dari Firestore
            // Password dan role kini diambil dari guru Firestore
            const waliKelas = classes.filter(k => k.homeroomTeacherId === guru.id).map(k => k.name).join(', ');
            return (
              <tr key={guru.id} style={{ borderBottom: `1px solid ${appTheme.border}` }}>
                <td style={{ padding: 12 }}>{idx + 1}</td>
                <td style={{ padding: 12 }}>{guru.name}</td>
                <td style={{ padding: 12 }}>{guru.id}</td>
                <td style={{ padding: 12 }}>{guru.password ? guru.password : '-'}</td>
                <td style={{ padding: 12 }}>{guru.role ? guru.role : '-'}</td>
                <td style={{ padding: 12 }}>{pelajaran.length > 0 ? pelajaran.join(', ') : '-'}</td>
                <td style={{ padding: 12 }}>{waliKelas || '-'}</td>
                <td style={{ padding: 12 }}>{jadwal.length > 0 ? jadwal.map((j, i) => <div key={i}>{j}</div>) : '-'}</td>
                <td style={{ padding: 12 }}>
                  {role === 'admin' ? (
                    editId === guru.id ? null : (
                      <button onClick={() => handleEdit(guru.id, guru.name)} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                    )
                  ) : (
                    editId === guru.id ? (
                      <>
                        <input type="password" placeholder="Password baru (opsional)" value={editPassword} onChange={e => setEditPassword(e.target.value)} style={{ marginRight: 8, padding: 6, borderRadius: 6, border: `1px solid ${appTheme.border}` }} />
                        <button onClick={handleEditSave} style={{ marginRight: 8, background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Simpan</button>
                        <button onClick={() => setEditId(null)} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
                      </>
                    ) : (
                      <button onClick={() => handleEdit(guru.id, guru.name)} style={{ background: appTheme.primaryColor, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                    )
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
