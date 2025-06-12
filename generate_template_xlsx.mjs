// Script untuk generate template_import_siswa.xlsx (ESM)
import XLSX from 'xlsx';
import { writeFile } from 'fs/promises';

const data = [
  ['Nama', 'Kelas'],
  ['Budi Santoso', 'X IPA 1'],
  ['Siti Aminah', 'X IPA 1'],
  ['Andi Wijaya', 'X IPA 2'],
  ['Dewi Lestari', 'X IPS 1'],
  ['Rizky Pratama', 'X IPA 2'],
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Siswa');
const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
await writeFile('public/template_import_siswa.xlsx', buf);
console.log('template_import_siswa.xlsx generated');
