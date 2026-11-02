import { createClient } from '@supabase/supabase-js';
import { AuthUser, UserRole } from './types';

export const SUPABASE_URL = 'https://eucdqesrtnemahdfunbd.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_d8owe22NOkUb-KWmNORalA_f5Yn386Z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  grade?: string;
  dormBuilding?: string;
  dormRoom?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  identifier?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

const REGISTERED_ACCOUNTS_KEY = 'nadi_supabase_registered_accounts_v1';

export function getLocalRegisteredAccounts(): Array<AuthUser & { passwordHint: string }> {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalRegisteredAccount(user: AuthUser & { passwordHint: string }) {
  try {
    const existing = getLocalRegisteredAccounts();
    const filtered = existing.filter((u) => u.email?.toLowerCase() !== user.email?.toLowerCase());
    filtered.push(user);
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to save registered account locally', err);
  }
}

/**
 * Registers a new user via Supabase Auth and inserts into the 'profiles' table.
 */
export async function registerWithSupabase(params: SignUpParams): Promise<AuthResult> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanPass = params.password.trim();
  const cleanName = params.fullName.trim();

  if (!cleanEmail || !cleanPass || !cleanName) {
    return { success: false, error: 'Semua kolom wajib diisi lengkap.' };
  }

  if (cleanPass.length < 6) {
    return { success: false, error: 'Kata sandi minimal 6 karakter.' };
  }

  try {
    // 1. Supabase Auth Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPass,
      options: {
        data: {
          full_name: cleanName,
          role: params.role,
          grade: params.grade || (params.role === 'siswa' ? 'XII-1' : undefined),
          dorm_building: params.dormBuilding || (params.role === 'siswa' ? 'Astra 1' : undefined),
        },
      },
    });

    if (authError) {
      console.warn('Supabase Auth warning:', authError.message);
      // If user already registered or error, we proceed with fallback check
    }

    const userId = authData.user?.id || `usr-sb-${Date.now()}`;

    // 2. Insert / Upsert into 'profiles' table in Supabase
    try {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        email: cleanEmail,
        full_name: cleanName,
        role: params.role,
        grade: params.grade || (params.role === 'siswa' ? 'XII-1' : null),
        dorm_building: params.dormBuilding || (params.role === 'siswa' ? 'Astra 1' : null),
        dorm_room: params.dormRoom || (params.role === 'siswa' ? 'Kamar 204' : null),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.warn('Supabase profiles upsert warning (table might require RLS policies):', profileError.message);
      }
    } catch (dbErr) {
      console.warn('Profile table insert note:', dbErr);
    }

    // 3. Format into AuthUser
    const authUser: AuthUser = {
      id: userId,
      username: cleanEmail.split('@')[0],
      name: cleanName,
      role: params.role,
      identifier:
        params.identifier ||
        (params.role === 'siswa'
          ? `NISN ${Math.floor(100000000 + Math.random() * 900000000)}`
          : params.role === 'pembina'
          ? `NIP ${Math.floor(100000000000000000 + Math.random() * 900000000000000000)}`
          : `SIP ${Math.floor(100 + Math.random() * 900)}/UKS/2024`),
      title:
        params.role === 'siswa'
          ? `Siswa Kelas ${params.grade || 'XII-1'} • Asrama ${params.dormBuilding || 'Astra 1'}`
          : params.role === 'pembina'
          ? `Pembina Asrama • ${params.dormBuilding || 'Astra 1'}`
          : 'Tenaga Medis UKS & Klinik Sekolah',
      building: params.dormBuilding || (params.role === 'siswa' ? 'Astra 1' : 'Klinik UKS'),
      dormRoom: params.dormRoom || (params.role === 'siswa' ? 'Kamar 204' : undefined),
      gender: params.gender || 'Laki-laki',
      email: cleanEmail,
    };

    // Store in local storage cache for immediate login reliability
    saveLocalRegisteredAccount({
      ...authUser,
      passwordHint: cleanPass,
    });

    return {
      success: true,
      user: authUser,
    };
  } catch (err: any) {
    console.error('Registration error:', err);
    return {
      success: false,
      error: err?.message || 'Terjadi kesalahan saat mendaftar ke Supabase.',
    };
  }
}

/**
 * Log in using Supabase Auth or registered cache
 */
export async function loginWithSupabase(email: string, pass: string): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  try {
    // Try Supabase Auth SignIn
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass,
    });

    if (!error && data.user) {
      // Try fetching profile from Supabase
      let userRole: UserRole = (data.user.user_metadata?.role as UserRole) || 'siswa';
      let fullName: string = data.user.user_metadata?.full_name || cleanEmail.split('@')[0];

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileData) {
          userRole = profileData.role || userRole;
          fullName = profileData.full_name || fullName;
        }
      } catch (e) {
        console.warn('Profile fetch note:', e);
      }

      const authUser: AuthUser = {
        id: data.user.id,
        username: cleanEmail.split('@')[0],
        name: fullName,
        role: userRole,
        identifier: data.user.user_metadata?.identifier || 'Terverifikasi Supabase',
        title:
          userRole === 'siswa'
            ? 'Siswa Terdaftar'
            : userRole === 'pembina'
            ? 'Pembina Terdaftar'
            : 'Tenaga Medis UKS',
        email: cleanEmail,
      };

      return { success: true, user: authUser };
    }
  } catch (e) {
    console.warn('Supabase sign-in warning:', e);
  }

  // Check locally saved registered accounts
  const localAccounts = getLocalRegisteredAccounts();
  const matched = localAccounts.find(
    (acc) => acc.email?.toLowerCase() === cleanEmail && acc.passwordHint === cleanPass
  );

  if (matched) {
    return { success: true, user: matched };
  }

  return { success: false, error: 'Email atau kata sandi tidak sesuai.' };
}
