export type TriageUrgency = 'HIJAU' | 'KUNING' | 'MERAH';

export type UserRole = 'siswa' | 'pembina' | 'nakes';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  identifier: string; // NISN for student, NIP for teacher/warden, SIP/STR for healthcare
  title: string; // e.g. "Siswa Kelas XI MIPA 2", "Pembina Asrama Putra Al-Farabi", "Perawat Medis UKS Sekolah"
  building?: string; // e.g. "Gedung Asrama Putra Al-Farabi"
  dormRoom?: string; // e.g. "Kamar 204"
  gender?: 'Laki-laki' | 'Perempuan';
  avatarColor?: string;
  phone?: string;
  email?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  triageLevel?: TriageUrgency | null;
  structuredCheck?: {
    keluhanUtama?: string;
    urgensi?: TriageUrgency;
    penjelasan?: string;
    tindakanSekarang?: string[];
    tandaBahaya?: string[];
    tindakLanjut?: string;
  } | null;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export const CLASSES_XII = ['XII-1', 'XII-2', 'XII-3', 'XII-4'] as const;
export const CLASSES_XI = ['XI-1', 'XI-2', 'XI-3', 'XI-4', 'XI-5', 'XI-6'] as const;
export const CLASSES_X = ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6'] as const;
export const ALL_SCHOOL_CLASSES = [...CLASSES_XII, ...CLASSES_XI, ...CLASSES_X] as const;

export type SchoolClass = (typeof ALL_SCHOOL_CLASSES)[number];

export interface DormConfig {
  id: string;
  name: string;
  gender: 'Laki-laki' | 'Perempuan';
  gradeName: 'Kelas XII' | 'Kelas XI' | 'Kelas X';
  gradePrefix: 'XII' | 'XI' | 'X';
  classes: readonly string[];
  description: string;
}

export const SCHOOL_DORMS: DormConfig[] = [
  {
    id: 'Astra 1',
    name: 'Asrama Astra 1',
    gender: 'Laki-laki',
    gradeName: 'Kelas XII',
    gradePrefix: 'XII',
    classes: CLASSES_XII,
    description: 'Asrama Putra - Khusus Siswa Kelas XII (1-4)',
  },
  {
    id: 'Astra 2',
    name: 'Asrama Astra 2',
    gender: 'Laki-laki',
    gradeName: 'Kelas XI',
    gradePrefix: 'XI',
    classes: CLASSES_XI,
    description: 'Asrama Putra - Khusus Siswa Kelas XI (1-6)',
  },
  {
    id: 'Astra 3',
    name: 'Asrama Astra 3',
    gender: 'Laki-laki',
    gradeName: 'Kelas X',
    gradePrefix: 'X',
    classes: CLASSES_X,
    description: 'Asrama Putra - Khusus Siswa Kelas X (1-6)',
  },
  {
    id: 'Astri 1',
    name: 'Asrama Astri 1',
    gender: 'Perempuan',
    gradeName: 'Kelas XII',
    gradePrefix: 'XII',
    classes: CLASSES_XII,
    description: 'Asrama Putri - Khusus Siswi Kelas XII (1-4)',
  },
  {
    id: 'Astri 2',
    name: 'Asrama Astri 2',
    gender: 'Perempuan',
    gradeName: 'Kelas XI',
    gradePrefix: 'XI',
    classes: CLASSES_XI,
    description: 'Asrama Putri - Khusus Siswi Kelas XI (1-6)',
  },
  {
    id: 'Astri 3',
    name: 'Asrama Astri 3',
    gender: 'Perempuan',
    gradeName: 'Kelas X',
    gradePrefix: 'X',
    classes: CLASSES_X,
    description: 'Asrama Putri - Khusus Siswi Kelas X (1-6)',
  },
];

export function getDormForStudent(gender: 'Laki-laki' | 'Perempuan', gradeClass: string): string {
  const isMale = gender === 'Laki-laki';
  if (gradeClass.startsWith('XII')) {
    return isMale ? 'Astra 1' : 'Astri 1';
  }
  if (gradeClass.startsWith('XI')) {
    return isMale ? 'Astra 2' : 'Astri 2';
  }
  return isMale ? 'Astra 3' : 'Astri 3';
}

export interface StudentProfile {
  name: string;
  grade: string; // e.g. "XII-1"
  dormBuilding: string; // e.g. "Astra 1"
  dormRoom: string; // e.g. "Kamar 204"
  gender: 'Laki-laki' | 'Perempuan';
  allergies: string; // e.g. "Alergi Seafood, Amoksisilin"
  bloodType?: string; // e.g. "O", "A", "B", "AB"
  emergencyContactName: string; // e.g. "Pak Ahmad Rahmat, S.Pd. (Pembina Astra 1)"
  emergencyContactPhone: string; // e.g. "0812-8877-6655"
  uksContactPhone: string; // e.g. "0821-4433-2211"
}

export interface HealthRecord {
  id: string;
  studentId?: string;
  studentName?: string;
  grade?: string;
  dormRoom?: string;
  dormBuilding?: string;
  timestamp: string;
  complaintTitle: string;
  complaintDetails: string;
  severity: number; // 1 to 10
  duration: string; // e.g. "2 hari"
  triageLevel: TriageUrgency;
  actionsTaken: string;
  status: 'Aktif' | 'Membaik' | 'Selesai' | 'Dirujuk ke UKS' | 'Observasi Rawat UKS' | 'Rujuk RS';
  vitalSigns?: {
    temperature?: string; // e.g. "38.2°C"
    bloodPressure?: string; // e.g. "110/75 mmHg"
    pulse?: string; // e.g. "88 bpm"
    respiration?: string; // e.g. "20 x/menit"
    spO2?: string; // e.g. "98%"
  };
  clinicalNotes?: string; // Input from Nakes
  dispensationApproved?: boolean; // Izin istirahat KBM approved by Pembina/Nakes
  dispensationDays?: number; // e.g. 1 hari
  medicationsGiven?: string[]; // e.g. ["Paracetamol 500mg 3x1", "Antasida suspensi"]
  updates: Array<{
    id: string;
    timestamp: string;
    authorRole?: 'siswa' | 'pembina' | 'nakes';
    authorName?: string;
    note: string;
    statusChange?: 'Aktif' | 'Membaik' | 'Selesai' | 'Dirujuk ke UKS' | 'Observasi Rawat UKS' | 'Rujuk RS';
    temperature?: string;
  }>;
}

export interface UKSReferralSlip {
  ringkasanKeluhan: string;
  dugaanKategori: string;
  urgensi: TriageUrgency;
  tindakanAwal: string;
  rekomendasiUntukUKS: string;
  tandaBahaya: string;
  generatedAt: string;
  studentName?: string;
  dormRoom?: string;
  grade?: string;
}

export interface EducationArticle {
  id: string;
  title: string;
  category: 'Penyakit Menular Asrama' | 'Pencernaan & Nutrisi' | 'Kesehatan Kulit' | 'Kesehatan Mental & Tidur' | 'Pertolongan Pertama' | 'Kesehatan Siswi';
  readTime: string;
  badge: string;
  summary: string;
  content: string[];
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
  redFlags: string[];
  source: string;
}
