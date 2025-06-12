// Script untuk generate template_import_siswa.xlsx
const XLSX = require('xlsx');

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
XLSX.writeFile(wb, 'public/template_import_siswa.xlsx');
