import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatScreen } from './components/ChatScreen';
import { GuidedTriageView } from './components/GuidedTriageView';
import { HealthDiaryView } from './components/HealthDiaryView';
import { EducationView } from './components/EducationView';
import { EmergencySosModal } from './components/EmergencySosModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { UksSlipModal } from './components/UksSlipModal';
import { LoginModal } from './components/LoginModal';
import { PembinaDashboard } from './components/PembinaDashboard';
import { NakesDashboard } from './components/NakesDashboard';
import { InitialDashboard } from './components/InitialDashboard';
import { AccessRestrictedView } from './components/AccessRestrictedView';
import {
  ChatMessage,
  StudentProfile,
  HealthRecord,
  UKSReferralSlip,
  AuthUser,
  UserRole,
  ChatSession,
} from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredRecords,
  saveStoredRecords,
  getStoredAuthUser,
  saveStoredAuthUser,
  getUserChatSessions,
  saveUserChatSessions,
  getActiveSessionId,
  saveActiveSessionId,
  getGreetingForUser,
  DEMO_USERS,
} from './utils/storage';
import { getOfflineTriageFallback } from './utils/triageFallback';

const INITIAL_GREETING: ChatMessage = {
  id: 'greet-1',
  role: 'model',
  text: `Halo! Saya NADI (NADI Health Intelligence), asisten skrining kesehatan digital untuk asrama sekolahmu.

Saya siap membantu kamu melakukan evaluasi awal keluhan kesehatan, memantau perkembangan kondisi di kamar asrama, serta memberikan panduan penanganan yang aman. Ingat, saya bukan pengganti dokter, namun saya dapat membantumu mengenali langkah awal yang tepat dan kapan harus segera melapor ke Pembina atau petugas UKS.

Apa keluhan kesehatan atau gejala yang kamu rasakan hari ini?`,
  timestamp: new Date().toISOString(),
};

/**
 * Strict Role-Based Access Control (RBAC) Checker
 */
function isTabAuthorized(tab: string, role?: UserRole): boolean {
  // Public tabs accessible to everyone
  if (tab === 'landing' || tab === 'education') return true;
  if (!role) return tab === 'landing';

  // Siswa: strictly student screening, symptom check, personal health diary
  if (role === 'siswa') {
    return ['chat', 'quick-triage', 'diary'].includes(tab);
  }

  // Pembina: strictly dormitory room monitoring and AI consultation
  if (role === 'pembina') {
    return ['dorm-monitor', 'chat'].includes(tab);
  }

  // Nakes: clinic queue, vital records, pharmacy, and cluster monitoring
  if (role === 'nakes') {
    return ['clinic-queue', 'dorm-monitor', 'chat'].includes(tab);
  }

  return false;
}

export default function App() {
  // Current logged in user (Siswa / Pembina / Nakes)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredAuthUser);

  const initialTab = !currentUser
    ? 'landing'
    : currentUser.role === 'pembina'
    ? 'dorm-monitor'
    : currentUser.role === 'nakes'
    ? 'clinic-queue'
    : 'chat';

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Stored state
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile);
  const [records, setRecords] = useState<HealthRecord[]>(getStoredRecords);

  // Per-account chat sessions
  const currentUserKey = currentUser?.id || currentUser?.username || 'tamu-umum';
  const [sessions, setSessions] = useState<ChatSession[]>(() =>
    getUserChatSessions(currentUserKey, currentUser?.role, currentUser?.name)
  );
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const saved = getActiveSessionId(currentUserKey);
    return saved && sessions.some((s) => s.id === saved) ? saved : sessions[0]?.id || `sess-${Date.now()}`;
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeSlip, setActiveSlip] = useState<UKSReferralSlip | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  // When currentUser changes (user logs in, registers, switches account, or logs out):
  // Load that specific account's private chat sessions so other accounts' chats are NEVER visible!
  useEffect(() => {
    const key = currentUser?.id || currentUser?.username || 'tamu-umum';
    const userSessions = getUserChatSessions(key, currentUser?.role, currentUser?.name);
    setSessions(userSessions);
    const savedActive = getActiveSessionId(key);
    const validActive =
      savedActive && userSessions.some((s) => s.id === savedActive)
        ? savedActive
        : userSessions[0]?.id || `sess-${Date.now()}`;
    setActiveSessionId(validActive);
  }, [currentUser?.id, currentUser?.username]);

  // Sync sessions whenever they change for the current user
  useEffect(() => {
    if (sessions.length > 0) {
      const key = currentUser?.id || currentUser?.username || 'tamu-umum';
      saveUserChatSessions(key, sessions);
    }
  }, [sessions, currentUser?.id, currentUser?.username]);

  useEffect(() => {
    if (activeSessionId) {
      const key = currentUser?.id || currentUser?.username || 'tamu-umum';
      saveActiveSessionId(key, activeSessionId);
    }
  }, [activeSessionId, currentUser?.id, currentUser?.username]);

  // Sync auth user, profile, and records
  useEffect(() => {
    saveStoredAuthUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredRecords(records);
  }, [records]);

  // Active session and active messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  // Handle Login & Role Switch
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'pembina') {
      setActiveTab('dorm-monitor');
    } else if (user.role === 'nakes') {
      setActiveTab('clinic-queue');
    } else {
      setActiveTab('chat');
      // Update student profile name if logged in as student
      if (user.role === 'siswa') {
        setProfile((prev) => ({
          ...prev,
          name: user.name,
          grade: user.id === 'user-siswa-1' ? 'XII-1' : prev.grade,
          dormRoom: user.dormRoom || prev.dormRoom,
          dormBuilding: user.building || prev.dormBuilding,
        }));
      }
    }
  };

  const handleLogout = () => {
    saveStoredAuthUser(null);
    setCurrentUser(null);
    setActiveTab('landing');
  };

  // Send message to NADI Backend API
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    // Append to active session and update session title if first user message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        const isFirst = s.messages.filter((m) => m.role === 'user').length === 0;
        const newTitle = isFirst ? (text.length > 28 ? text.slice(0, 28) + '...' : text) : s.title;
        return {
          ...s,
          title: newTitle,
          updatedAt: new Date().toISOString(),
          messages: [...s.messages, userMsg],
        };
      })
    );

    setIsLoading(true);

    const sessionMessages = [...messages, userMsg];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 28000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: sessionMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          studentProfile: profile,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toISOString(),
        triageLevel: data.triageLevel,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, modelMsg],
          };
        })
      );

      // If Emergency Red is detected by AI, open emergency modal
      if (data.triageLevel === 'MERAH') {
        setIsEmergencyModalOpen(true);
      }
    } catch (err: any) {
      console.warn('Network issue encountered, using NADI clinical fallback:', err?.message || err);
      const fallbackResult = getOfflineTriageFallback(text, profile);
      const fallbackMsg: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        text: fallbackResult.reply,
        timestamp: new Date().toISOString(),
        triageLevel: fallbackResult.triageLevel,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, fallbackMsg],
          };
        })
      );

      if (fallbackResult.triageLevel === 'MERAH') {
        setIsEmergencyModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Bersihkan percakapan sesi ini?')) {
      const freshGreeting = getGreetingForUser(currentUser?.role, currentUser?.name);
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          return {
            ...s,
            title: 'Sesi Skrining',
            updatedAt: new Date().toISOString(),
            messages: [freshGreeting],
          };
        })
      );
    }
  };

  const handleCreateNewSession = () => {
    const freshGreeting = getGreetingForUser(currentUser?.role, currentUser?.name);
    const newSession: ChatSession = {
      id: `sess-${Date.now()}`,
      userId: currentUserKey,
      title: 'Sesi Skrining Baru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [freshGreeting],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh = getUserChatSessions(currentUserKey, currentUser?.role, currentUser?.name);
        setActiveSessionId(fresh[0].id);
        return fresh;
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Add Health Record (Synchronized across all roles: Siswa, Nakes, Pembina)
  const handleAddRecord = (recordData: Omit<HealthRecord, 'id' | 'updates'>) => {
    const studentName = currentUser?.role === 'siswa' ? currentUser.name : profile.name;
    const grade = currentUser?.role === 'siswa' && currentUser.title?.includes('XII-1') ? 'XII-1' : profile.grade || 'XII-1';
    const dormBuilding = currentUser?.building || profile.dormBuilding || 'Astra 1';
    const dormRoom = currentUser?.dormRoom || profile.dormRoom || 'Kamar 204';

    const newRecord: HealthRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
      studentId: currentUser?.id || 'user-siswa-1',
      studentName,
      grade,
      dormRoom,
      dormBuilding,
      updates: [
        {
          id: `up-${Date.now()}`,
          timestamp: new Date().toISOString(),
          authorRole: currentUser?.role || 'siswa',
          authorName: currentUser?.name || studentName,
          note: `Keluhan dicatat ke sistem rekam medis (${recordData.complaintTitle}).`,
        },
      ],
    };

    setRecords((prev) => [newRecord, ...prev]);
  };

  // Update Health Record
  const handleUpdateRecord = (
    recordId: string,
    updateNote: string,
    newStatus?: 'Aktif' | 'Membaik' | 'Selesai' | 'Dirujuk ke UKS' | 'Observasi Rawat UKS' | 'Rujuk RS',
    temperature?: string
  ) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== recordId) return rec;
        return {
          ...rec,
          status: newStatus || rec.status,
          vitalSigns: temperature
            ? { ...rec.vitalSigns, temperature }
            : rec.vitalSigns,
          updates: [
            ...rec.updates,
            {
              id: `up-${Date.now()}`,
              timestamp: new Date().toISOString(),
              authorRole: currentUser?.role || 'pembina',
              authorName: currentUser?.name || profile.name,
              note: updateNote,
              statusChange: newStatus,
              temperature,
            },
          ],
        };
      })
    );
  };

  // Quick Triage Submission
  const handleGuidedTriageSubmit = (promptText: string) => {
    setActiveTab('chat');
    handleSendMessage(promptText);
  };

  // Open UKS Slip
  const handleOpenUksSlip = (slip: UKSReferralSlip) => {
    setActiveSlip(slip);
    setIsSlipModalOpen(true);
  };

  const activeRecordsCount = records.filter(
    (r) => r.status === 'Aktif' || r.status === 'Dirujuk ke UKS' || r.status === 'Observasi Rawat UKS'
  ).length;

  // Verify RBAC Authorization for requested activeTab
  const isAuthorized = isTabAuthorized(activeTab, currentUser?.role);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentProfile={profile}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        hasActiveRecordsCount={activeRecordsCount}
      />

      {/* Main Views */}
      <main className="flex-1 flex flex-col">
        {/* If user tries to access a view outside their authorized role, show Apple 403 Forbidden */}
        {!isAuthorized ? (
          <AccessRestrictedView
            currentUser={currentUser}
            targetViewName={
              activeTab === 'dorm-monitor'
                ? 'Monitoring Gedung Asrama'
                : activeTab === 'clinic-queue'
                ? 'Antrean & Rekam Medis UKS'
                : activeTab === 'diary'
                ? 'Buku Rekap Siswa'
                : activeTab
            }
            onReturnToAllowed={() => {
              if (currentUser?.role === 'pembina') setActiveTab('dorm-monitor');
              else if (currentUser?.role === 'nakes') setActiveTab('clinic-queue');
              else if (currentUser?.role === 'siswa') setActiveTab('chat');
              else setActiveTab('landing');
            }}
            onLogout={handleLogout}
          />
        ) : (
          <>
            {/* Dashboard Awal / Landing Portal with 3 Demo Accounts & Email Login */}
            {activeTab === 'landing' && (
              <InitialDashboard
                onLogin={handleLogin}
                onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                currentUser={currentUser}
                onNavigateToRole={() => {
                  if (currentUser?.role === 'pembina') setActiveTab('dorm-monitor');
                  else if (currentUser?.role === 'nakes') setActiveTab('clinic-queue');
                  else setActiveTab('chat');
                }}
              />
            )}

            {/* Siswa / General Chat Screen */}
            {activeTab === 'chat' && (
              <ChatScreen
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onClearChat={handleClearChat}
                studentProfile={profile}
                currentUser={currentUser}
                onOpenUksSlip={handleOpenUksSlip}
                onSaveToDiary={handleAddRecord}
                onTriggerEmergency={() => setIsEmergencyModalOpen(true)}
                onNavigateToQuickTriage={() => setActiveTab('quick-triage')}
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={(id) => setActiveSessionId(id)}
                onCreateNewSession={handleCreateNewSession}
                onDeleteSession={handleDeleteSession}
              />
            )}

            {/* Siswa Guided Triage */}
            {activeTab === 'quick-triage' && currentUser?.role === 'siswa' && (
              <GuidedTriageView
                studentProfile={profile}
                onSubmitTriage={handleGuidedTriageSubmit}
                onEmergencyTrigger={() => setIsEmergencyModalOpen(true)}
              />
            )}

            {/* Siswa Diary View (Personal Records Only) */}
            {activeTab === 'diary' && currentUser?.role === 'siswa' && (
              <HealthDiaryView
                records={records.filter(
                  (r) =>
                    !r.studentId ||
                    r.studentId === currentUser?.id ||
                    r.studentName === profile.name ||
                    (currentUser?.name && r.studentName === currentUser.name)
                )}
                onAddRecord={handleAddRecord}
                onUpdateRecord={handleUpdateRecord}
                onOpenUksSlip={handleOpenUksSlip}
                onConsultNadi={(prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
                studentProfile={profile}
              />
            )}

            {/* Pembina Dorm Monitor Dashboard */}
            {activeTab === 'dorm-monitor' && (currentUser?.role === 'pembina' || currentUser?.role === 'nakes') && (
              <PembinaDashboard
                currentUser={currentUser}
                records={records}
                onUpdateRecord={handleUpdateRecord}
                onOpenUksSlip={handleOpenUksSlip}
                onConsultNadi={(prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
                onEmergencyTrigger={() => setIsEmergencyModalOpen(true)}
              />
            )}

            {/* Nakes / UKS Clinic Queue Dashboard */}
            {activeTab === 'clinic-queue' && currentUser?.role === 'nakes' && (
              <NakesDashboard
                currentUser={currentUser}
                records={records}
                onUpdateRecord={handleUpdateRecord}
                onOpenUksSlip={handleOpenUksSlip}
                onConsultNadi={(prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
                onEmergencyTrigger={() => setIsEmergencyModalOpen(true)}
              />
            )}

            {/* Education View */}
            {activeTab === 'education' && (
              <EducationView
                onAskNadi={(prompt) => {
                  setActiveTab('chat');
                  handleSendMessage(prompt);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
      />

      <EmergencySosModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        studentProfile={profile}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={setProfile}
      />

      <UksSlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        slip={activeSlip}
        studentProfile={profile}
      />
    </div>
  );
}
