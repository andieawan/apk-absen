import { useState } from 'react';
import { appTheme } from '../utils/auth';

interface GradeCategory {
  name: string;
  weight: number;
}

interface StudentGrade {
  name: string;
  grades: { [category: string]: number };
}

export default function GradingPage() {
  const [categories, setCategories] = useState<GradeCategory[]>([
    { name: 'Tugas', weight: 30 },
    { name: 'Ujian', weight: 70 },
  ]);
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [newCat, setNewCat] = useState('');
  const [newWeight, setNewWeight] = useState(0);
  const [newStudent, setNewStudent] = useState('');

  const addCategory = () => {
    if (!newCat || categories.find(c => c.name === newCat)) return;
    setCategories([...categories, { name: newCat, weight: newWeight }]);
    setNewCat('');
    setNewWeight(0);
  };

  const addStudent = () => {
    if (!newStudent || students.find(s => s.name === newStudent)) return;
    setStudents([...students, { name: newStudent, grades: {} }]);
    setNewStudent('');
  };

  const setGrade = (studentIdx: number, cat: string, value: number) => {
    setStudents(students => students.map((s, i) => i === studentIdx ? { ...s, grades: { ...s.grades, [cat]: value } } : s));
  };

  return (
    <div style={{ background: appTheme.card, borderRadius: appTheme.radius, boxShadow: appTheme.shadow, border: `1px solid ${appTheme.border}`, padding: 24, marginTop: 16 }}>
      <h2 style={{ color: appTheme.primary, marginTop: 0 }}>Penilaian Siswa</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input type="text" placeholder="Kategori nilai" value={newCat} onChange={e => setNewCat(e.target.value)} style={{ flex: 2, padding: 10, borderRadius: 8, border: `1px solid ${appTheme.border}` }} />
        <input type="number" placeholder="Bobot (%)" value={newWeight} onChange={e => setNewWeight(Number(e.target.value))} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${appTheme.border}` }} />
        <button type="button" onClick={addCategory} style={{ flex: 1, background: appTheme.primary, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Tambah Kategori</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input type="text" placeholder="Nama siswa" value={newStudent} onChange={e => setNewStudent(e.target.value)} style={{ flex: 2, padding: 10, borderRadius: 8, border: `1px solid ${appTheme.border}` }} />
        <button type="button" onClick={addStudent} style={{ flex: 1, background: appTheme.primary, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Tambah Siswa</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
          <thead style={{ background: appTheme.primary, color: '#fff' }}>
            <tr>
              <th style={{ padding: 10 }}>Nama</th>
              {categories.map(cat => (
                <th key={cat.name} style={{ padding: 10 }}>{cat.name} ({cat.weight}%)</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${appTheme.border}` }}>
                <td style={{ padding: 10 }}>{s.name}</td>
                {categories.map(cat => (
                  <td key={cat.name} style={{ padding: 10 }}>
                    <input
                      type="number"
                      value={s.grades[cat.name] || ''}
                      onChange={e => setGrade(i, cat.name, Number(e.target.value))}
                      style={{ width: 60, padding: 6, borderRadius: 6, border: `1px solid ${appTheme.border}` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
