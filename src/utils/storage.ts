import { StudentProfile, HealthRecord, ChatMessage, AuthUser } from '../types';

const AUTH_USER_KEY = 'nadi_auth_user_v1';
const PROFILE_KEY = 'nadi_student_profile_v1';
const RECORDS_KEY = 'nadi_health_records_v1';
const CHAT_KEY = 'nadi_chat_history_v1';

export const DEMO_USERS: Record<string, AuthUser & { passwordHint: string }> = {
  siswa: {
    id: 'user-siswa-1',
    username: 'shadiqia',
    name: 'Shadiqia Fattaraditya Harjanto',
    role: 'siswa',
    identifier: 'NISN 007238192',
    title: 'Siswa Kelas XII-1 • Asrama Astra 1',
    building: 'Astra 1',
    dormRoom: 'Kamar 204 (Lantai 2)',
    gender: 'Laki-laki',
    phone: '0813-1122-3344',
    email: 'shadiqiaharjanto0@gmail.com',
    passwordHint: 'siswa123',
  },
  pembina: {
    id: 'user-pembina-1',
    username: 'pembina',
    name: 'Pak Ahmad Rahmat, S.Pd.',
    role: 'pembina',
    identifier: 'NIP 198504122010011003',
    title: 'Kepala Pembina Asrama Putra Astra 1 (Kelas XII) & Wali Asrama',
    building: 'Astra 1',
    phone: '0812-8877-6655',
    email: 'pembina@nadikita.sch.id',
    passwordHint: 'pembina123',
  },
  nakes: {
    id: 'user-nakes-1',
    username: 'nakes',
    name: 'dr. Nurul Hidayah',
    role: 'nakes',
    identifier: 'SIP 503/440/SIP-D/2024',
    title: 'Koordinator Medis Unit Kesehatan Sekolah (UKS) & Pos Medis Asrama',
    building: 'Klinik & Pos Medis UKS',
    phone: '0821-4433-2211',
    email: 'klinik.uks@nadi.sch.id',
    passwordHint: 'nakes123',
  },
};

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Shadiqia Fattaraditya Harjanto',
  grade: 'XII-1',
  dormBuilding: 'Astra 1',
  dormRoom: 'Kamar 204 (Lantai 2)',
  gender: 'Laki-laki',
  allergies: 'Tidak ada riwayat alergi obat berat; sensitif debu kasur',
  bloodType: 'O',
  emergencyContactName: 'Pak Ahmad Rahmat, S.Pd. (Pembina Astra 1)',
  emergencyContactPhone: '0812-8877-6655',
  uksContactPhone: '0821-4433-2211',
};

export const INITIAL_RECORDS: HealthRecord[] = [
  {
    id: 'rec-1',
    studentId: 'user-siswa-1',
    studentName: 'Shadiqia Fattaraditya Harjanto',
    grade: 'XII-1',
    dormBuilding: 'Astra 1',
    dormRoom: 'Kamar 204',
    timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    complaintTitle: 'Meriang, Sakit Tenggorokan & Badan Lemas',
    complaintDetails: 'Tenggorokan sakit saat menelan sejak kemarin sore setelah apel hujan-hujanan, suhu tubuh terukur 37.8°C di kamar 204.',
    severity: 5,
    duration: '2 hari',
    triageLevel: 'KUNING',
    actionsTaken: 'Istirahat di tempat tidur kamar Astra 1, banyak minum air hangat, paracetamol UKS.',
    status: 'Membaik',
    vitalSigns: {
      temperature: '37.4°C',
      bloodPressure: '110/70 mmHg',
      pulse: '78 bpm',
      spO2: '98%',
    },
    dispensationApproved: true,
    dispensationDays: 1,
    medicationsGiven: ['Paracetamol 500mg (3x1 sesudah makan)', 'Vitamin C 500mg'],
    updates: [
      {
        id: 'up-1',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        authorRole: 'siswa',
        authorName: 'Shadiqia Fattaraditya',
        note: 'Suhu 37.9°C, sudah lapor ke Pembina Astra 1 dan istirahat di kamar.',
        temperature: '37.9°C',
        statusChange: 'Aktif',
      },
      {
        id: 'up-2',
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        authorRole: 'nakes',
        authorName: 'dr. Nurul Hidayah',
        note: 'Pemeriksaan UKS: faring hiperemis ringan. Diberikan obat kumur antiseptik dan paracetamol. Izin istirahat KBM 1 hari disetujui.',
        temperature: '37.4°C',
        statusChange: 'Membaik',
      },
    ],
  },
  {
    id: 'rec-2',
    studentId: 'user-siswa-2',
    studentName: 'Fikri Haikal',
    grade: 'XII-1',
    dormBuilding: 'Astra 1',
    dormRoom: 'Kamar 204',
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    complaintTitle: 'Bintik Berair & Gatal Hebat di Sela Jari (Waspada Skabies)',
    complaintDetails: 'Gatal memuncak di malam hari di sela jari kedua tangan dan pergelangan. Sekamar dengan Shadiqia di Kamar 204 Astra 1.',
    severity: 6,
    duration: '4 hari',
    triageLevel: 'KUNING',
    actionsTaken: 'Cuci tangan dengan sabun, belum diberi salep, lapor ke UKS.',
    status: 'Dirujuk ke UKS',
    vitalSigns: {
      temperature: '36.7°C',
      bloodPressure: '115/75 mmHg',
      pulse: '80 bpm',
    },
    clinicalNotes: 'Dugaan kuat Skabies (Sarcoptes scabiei). Diinstruksikan pengobatan serentak satu kamar 204 Astra 1 dengan krim Permethrin 5% dan pencucian sprei air panas.',
    dispensationApproved: false,
    updates: [
      {
        id: 'up-201',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        authorRole: 'nakes',
        authorName: 'Ns. Siti Rahmah',
        note: 'Krim Permethrin 5% diserahkan ke pembina asrama untuk diaplikasikan malam ini serentak di kamar 204 Astra 1.',
        statusChange: 'Dirujuk ke UKS',
      },
    ],
  },
  {
    id: 'rec-3',
    studentId: 'user-siswa-3',
    studentName: 'Rayhan Athallah',
    grade: 'XI-3',
    dormBuilding: 'Astra 2',
    dormRoom: 'Kamar 108',
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    complaintTitle: 'Pergelangan Kaki Kanan Terkilir / Bengkak (Cedera Futsal)',
    complaintDetails: 'Terkilir saat tanding futsal sore di lapangan asrama. Pergelangan kaki kanan nyeri menumpu, bengkak ringan.',
    severity: 6,
    duration: 'Tadi sore',
    triageLevel: 'KUNING',
    actionsTaken: 'Protokol R.I.C.E awal di kamar asrama Astra 2: Kompres es batu dibungkus kain dan balut perban elastis tensocrepe.',
    status: 'Observasi Rawat UKS',
    vitalSigns: {
      temperature: '36.6°C',
      bloodPressure: '120/80 mmHg',
      pulse: '84 bpm',
    },
    clinicalNotes: 'Sprain pergelangan kaki lateral dextra grade I. Tidak ada tanda fraktur / krepitasi. Diposisikan elevasi di UKS.',
    dispensationApproved: true,
    dispensationDays: 2,
    updates: [
      {
        id: 'up-301',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        authorRole: 'pembina',
        authorName: 'Pak Ahmad Rahmat, S.Pd.',
        note: 'Siswa kelas XI-3 diistirahatkan di ruang rawat UKS sore ini, dibantu kruk saat berjalan.',
        statusChange: 'Observasi Rawat UKS',
      },
    ],
  },
  {
    id: 'rec-4',
    studentId: 'user-siswa-4',
    studentName: 'Dimas Aditya',
    grade: 'X-2',
    dormBuilding: 'Astra 3',
    dormRoom: 'Kamar 305',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    complaintTitle: 'Demam Tinggi 39.2°C, Menggigil & Nyeri Sendi Ekstrem (Waspada Dengue)',
    complaintDetails: 'Demam hari ke-3 siswa baru kelas X di Astra 3, nyeri di belakang bola mata, lemas ekstrem, dan mual tidak bisa makan.',
    severity: 9,
    duration: '3 hari',
    triageLevel: 'MERAH',
    actionsTaken: 'Dibaringkan di UKS, kompres air hangat, rehidrasi oralit.',
    status: 'Rujuk RS',
    vitalSigns: {
      temperature: '39.2°C',
      bloodPressure: '100/65 mmHg',
      pulse: '102 bpm',
      spO2: '97%',
    },
    clinicalNotes: 'Suspek Dengue Fever hari ke-3 fase kritis. Rujuk ke IGD RSUD untuk cek DL lengkap (Trombosit & Ht) dan infus cairan ringer laktat.',
    dispensationApproved: true,
    dispensationDays: 3,
    updates: [
      {
        id: 'up-401',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        authorRole: 'nakes',
        authorName: 'dr. Nurul Hidayah',
        note: 'Ambulans sekolah disiapkan, didampingi Pembina Asrama Astra 3 menuju IGD RSUD.',
        statusChange: 'Rujuk RS',
      },
    ],
  },
  {
    id: 'rec-5',
    studentId: 'user-siswa-5',
    studentName: 'Aisyah Putri Rahmadani',
    grade: 'XII-2',
    dormBuilding: 'Astri 1',
    dormRoom: 'Kamar 104',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    complaintTitle: 'Nyeri Ulu Hati Melilit & Mual (Dispepsia / Maag Akut)',
    complaintDetails: 'Perut perih setelah telat sarapan saat jam belajar mandiri, perut kembung dan mual.',
    severity: 5,
    duration: '6 jam',
    triageLevel: 'KUNING',
    actionsTaken: 'Diberi air hangat dan teh manis encer di Asrama Astri 1.',
    status: 'Membaik',
    vitalSigns: {
      temperature: '36.8°C',
      bloodPressure: '105/70 mmHg',
      pulse: '76 bpm',
    },
    clinicalNotes: 'Sindrom dispepsia akut dipicu telat makan. Diberikan antasida kunyah 1 tab 30 menit ac dan istirahat 30 menit.',
    dispensationApproved: true,
    dispensationDays: 1,
    updates: [
      {
        id: 'up-501',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        authorRole: 'nakes',
        authorName: 'Ns. Siti Rahmah',
        note: 'Nyeri mereda setelah minum obat antasida. Boleh kembali ke kamar Astri 1.',
        statusChange: 'Membaik',
      },
    ],
  },
  {
    id: 'rec-6',
    studentId: 'user-siswa-6',
    studentName: 'Zahra Almira',
    grade: 'XI-5',
    dormBuilding: 'Astri 2',
    dormRoom: 'Kamar 202',
    timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    complaintTitle: 'Flu, Hidung Tersumbat & Sakit Kepala Berat',
    complaintDetails: 'Hidung mampet dan bersin-bersin sejak bangun tidur subuh, kepala pusing berdenyut di bagian depan.',
    severity: 4,
    duration: '1 hari',
    triageLevel: 'HIJAU',
    actionsTaken: 'Minum air hangat, istirahat di kamar Astri 2 dengan minyak kayu putih.',
    status: 'Aktif',
    vitalSigns: {
      temperature: '37.1°C',
      bloodPressure: '110/70 mmHg',
      pulse: '74 bpm',
    },
    clinicalNotes: 'Rinitis akut e.c. common cold / alergi udara dingin subuh.',
    dispensationApproved: false,
    updates: [
      {
        id: 'up-601',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        authorRole: 'siswa',
        authorName: 'Zahra Almira',
        note: 'Sudah mulai lega setelah kompres hangat.',
        statusChange: 'Aktif',
      },
    ],
  },
  {
    id: 'rec-7',
    studentId: 'user-siswa-7',
    studentName: 'Nabila Syakira',
    grade: 'X-5',
    dormBuilding: 'Astri 3',
    dormRoom: 'Kamar 301',
    timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    complaintTitle: 'Biduran / Kalikata Gatal Kemerahan di Lengan & Paha',
    complaintDetails: 'Muncul bentol-bentol merah gatal setelah makan lauk udang di ruang makan asrama tadi malam.',
    severity: 5,
    duration: '10 jam',
    triageLevel: 'KUNING',
    actionsTaken: 'Kompres dingin, tidak digaruk dengan kuku.',
    status: 'Dirujuk ke UKS',
    vitalSigns: {
      temperature: '36.5°C',
      bloodPressure: '112/72 mmHg',
      pulse: '78 bpm',
    },
    clinicalNotes: 'Urtikaria akut e.c. alergi makanan laut. Tidak ada sesak napas (stridor), bibir tidak bengkak.',
    dispensationApproved: false,
    updates: [
      {
        id: 'up-701',
        timestamp: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
        authorRole: 'nakes',
        authorName: 'dr. Nurul Hidayah',
        note: 'Diberikan Cetirizine 10mg 1x1 malam. Awasi tanda bahaya sesak napas.',
        statusChange: 'Dirujuk ke UKS',
      },
    ],
  },
];

export function getStoredAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto-migrate if role is siswa to ensure official name and class
      if (parsed.role === 'siswa' || parsed.id === 'user-siswa-1') {
        if (parsed.name !== DEMO_USERS.siswa.name || parsed.building !== 'Astra 1' || parsed.email !== DEMO_USERS.siswa.email) {
          saveStoredAuthUser(DEMO_USERS.siswa);
          return DEMO_USERS.siswa;
        }
      }
      if (parsed.role === 'pembina' || parsed.id === 'user-pembina-1') {
        if (parsed.name !== DEMO_USERS.pembina.name) {
          saveStoredAuthUser(DEMO_USERS.pembina);
          return DEMO_USERS.pembina;
        }
      }
      if (parsed.role === 'nakes' || parsed.id === 'user-nakes-1') {
        if (parsed.name !== DEMO_USERS.nakes.name || parsed.email !== DEMO_USERS.nakes.email) {
          saveStoredAuthUser(DEMO_USERS.nakes);
          return DEMO_USERS.nakes;
        }
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load auth user', e);
  }
  // Default to Siswa logged in for immediate usability
  return DEMO_USERS.siswa;
}

export function saveStoredAuthUser(user: AuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_USER_KEY);
    } else {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.warn('Failed to save auth user', e);
  }
}

export function getStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto migrate if previous profile was old placeholder or not matching current student
      if (
        parsed.name !== DEFAULT_PROFILE.name ||
        parsed.grade !== 'XII-1' ||
        parsed.dormBuilding !== 'Astra 1'
      ) {
        saveStoredProfile(DEFAULT_PROFILE);
        return DEFAULT_PROFILE;
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile', e);
  }
}

export function getStoredRecords(): HealthRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto migrate if records contain old Al-Farabi or MIPA references or missing Shadiqia
      if (
        Array.isArray(parsed) &&
        (parsed.some((r: any) => r.dormBuilding?.includes('Al-Farabi') || r.studentName?.includes('Nabil')) ||
         !parsed.some((r: any) => r.studentName === 'Shadiqia Fattaraditya Harjanto'))
      ) {
        saveStoredRecords(INITIAL_RECORDS);
        return INITIAL_RECORDS;
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load records', e);
  }
  return INITIAL_RECORDS;
}

export function saveStoredRecords(records: HealthRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('Failed to save records', e);
  }
}

export function getStoredChat(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load chat history', e);
  }
  return [];
}

export function saveStoredChat(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn('Failed to save chat history', e);
  }
}
