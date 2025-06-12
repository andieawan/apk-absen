// src/utils/firebase.ts
// Inisialisasi Firebase agar bisa digunakan di seluruh aplikasi
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Ganti config berikut dengan config project Firebase Anda sendiri
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const dbFirestore = getFirestore(app);

// Contoh helper CRUD Firestore untuk data guru
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';

export async function getAllTeachers() {
  const snap = await getDocs(collection(dbFirestore, 'teachers'));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addTeacher(teacher: { id: string; name: string }) {
  // id = doc id (username), name = nama guru
  await setDoc(doc(dbFirestore, 'teachers', teacher.id), { name: teacher.name });
}

export async function updateTeacher(id: string, data: any) {
  await updateDoc(doc(dbFirestore, 'teachers', id), data);
}

export async function deleteTeacher(id: string) {
  await deleteDoc(doc(dbFirestore, 'teachers', id));
}

export async function isUsernameTaken(username: string) {
  const q = query(collection(dbFirestore, 'teachers'), where('__name__', '==', username));
  const snap = await getDocs(q);
  return !snap.empty;
}
