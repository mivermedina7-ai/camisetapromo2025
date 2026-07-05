export type AdminRole = 'founder' | 'editor';

export interface Admin {
  id?: string;
  email: string;
  role: AdminRole;
  addedBy: string;
  addedAt: string;
}

export interface AdminRegistro {
  email: string;
  role: AdminRole;
  addedBy: string;
  addedAt: string;
}