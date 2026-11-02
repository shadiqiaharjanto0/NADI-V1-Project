import { StudentProfile, HealthRecord, ChatMessage, AuthUser, ChatSession, UserRole } from '../types';

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

export const INITIAL_RECORDS: HealthRecord[] = [];

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
  // Default to null so user lands on homepage overview and must log in
  return null;
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
      // Clean out previous mock data records
      if (
        Array.isArray(parsed) &&
        parsed.some((r: any) => r.id?.startsWith('rec-') && ['rec-1', 'rec-2', 'rec-3', 'rec-4'].includes(r.id))
      ) {
        saveStoredRecords([]);
        return [];
      }
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.warn('Failed to load records', e);
  }
  return [];
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

const SESSIONS_PREFIX = 'nadi_user_sessions_v2_';
const ACTIVE_SESSION_PREFIX = 'nadi_user_active_session_v2_';

export function getGreetingForUser(role: UserRole = 'siswa', name?: string): ChatMessage {
  const firstName = name ? name.split(' ')[0] : '';
  const greetingText =
    role === 'pembina'
      ? `Halo ${name || 'Bapak/Ibu Pembina'}! Saya NADI Health Intelligence. Siap membantu pemantauan kesehatan siswa/siswi asrama, evaluasi izin kasur KBM, dan SOP darurat.`
      : role === 'nakes'
      ? `Halo ${name || 'Tim Medis UKS'}! Saya NADI Health Intelligence. Siap mendukung triase klinis, pencatatan rekam medis, farmasi UKS, dan deteksi dini klaster penularan asrama.`
      : `Halo ${firstName || 'Siswa/Siswi'}! Saya NADI (NADI Health Intelligence), asisten kesehatan digital untuk asrama sekolahmu.\n\nSaya siap membantu kamu melakukan evaluasi awal keluhan kesehatan, memantau kondisi di kamar asrama, dan memberikan panduan pertolongan pertama yang aman.\n\nApa keluhan kesehatan atau gejala yang kamu rasakan hari ini?`;

  return {
    id: `greet-${Date.now()}`,
    role: 'model',
    text: greetingText,
    timestamp: new Date().toISOString(),
  };
}

export function getUserChatSessions(userIdOrKey: string, role: UserRole = 'siswa', name?: string): ChatSession[] {
  if (!userIdOrKey) return [];
  try {
    const raw = localStorage.getItem(`${SESSIONS_PREFIX}${userIdOrKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load user chat sessions', e);
  }

  const initialGreeting = getGreetingForUser(role, name);
  const defaultSession: ChatSession = {
    id: `sess-${Date.now()}`,
    userId: userIdOrKey,
    title: 'Sesi Skrining Awal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [initialGreeting],
  };

  saveUserChatSessions(userIdOrKey, [defaultSession]);
  return [defaultSession];
}

export function saveUserChatSessions(userIdOrKey: string, sessions: ChatSession[]): void {
  if (!userIdOrKey) return;
  try {
    localStorage.setItem(`${SESSIONS_PREFIX}${userIdOrKey}`, JSON.stringify(sessions));
  } catch (e) {
    console.warn('Failed to save user chat sessions', e);
  }
}

export function getActiveSessionId(userIdOrKey: string): string | null {
  if (!userIdOrKey) return null;
  return localStorage.getItem(`${ACTIVE_SESSION_PREFIX}${userIdOrKey}`);
}

export function saveActiveSessionId(userIdOrKey: string, sessionId: string): void {
  if (!userIdOrKey) return;
  localStorage.setItem(`${ACTIVE_SESSION_PREFIX}${userIdOrKey}`, sessionId);
}
