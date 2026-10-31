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
} from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredRecords,
  saveStoredRecords,
  getStoredChat,
  saveStoredChat,
  getStoredAuthUser,
  saveStoredAuthUser,
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
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = getStoredChat();
    return stored.length > 0 ? stored : [INITIAL_GREETING];
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeSlip, setActiveSlip] = useState<UKSReferralSlip | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveStoredAuthUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredRecords(records);
  }, [records]);

  useEffect(() => {
    saveStoredChat(messages);
  }, [messages]);

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

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
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

      setMessages((prev) => [...prev, modelMsg]);

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
      setMessages((prev) => [...prev, fallbackMsg]);

      if (fallbackResult.triageLevel === 'MERAH') {
        setIsEmergencyModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Mulai sesi skrining baru dengan NADI? Riwayat percakapan sebelumnya akan dibersihkan.')) {
      setMessages([INITIAL_GREETING]);
    }
  };

  // Add Health Record
  const handleAddRecord = (recordData: Omit<HealthRecord, 'id' | 'updates'>) => {
    const newRecord: HealthRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
      studentId: currentUser?.id || 'user-siswa-1',
      studentName: currentUser?.role === 'siswa' ? currentUser.name : profile.name,
      grade: profile.grade,
      dormRoom: profile.dormRoom,
      dormBuilding: profile.dormBuilding,
      updates: [],
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
              authorRole: currentUser?.role || 'siswa',
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
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col text-zinc-900 font-sans selection:bg-blue-100 selection:text-blue-900">
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
                onOpenUksSlip={handleOpenUksSlip}
                onSaveToDiary={handleAddRecord}
                onTriggerEmergency={() => setIsEmergencyModalOpen(true)}
                onNavigateToQuickTriage={() => setActiveTab('quick-triage')}
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
                  (r) => !r.studentId || r.studentId === currentUser?.id || r.studentName === profile.name
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
