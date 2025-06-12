// src/types/User.ts
export type UserRole = 'admin' | 'subject_teacher' | 'homeroom_teacher' | 'counselor';

export interface User {
  username: string;
  password: string;
  role: UserRole;
}
