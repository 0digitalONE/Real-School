import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { GameView } from './components/GameView';
import { DashboardView } from './components/DashboardView';
import { BadgesView } from './components/BadgesView';
import { ParentPortalModal } from './components/ParentPortalModal';
import { BadgeUnlockModal } from './components/BadgeUnlockModal';
import { ParentSettings, StudentProfile } from './types';
import { loadSettings, saveSettings, loadProfile, saveProfile, resetProfile } from './utils/storage';
import { playSound } from './utils/audio';

export default function App() {
  const [settings, setSettings] = useState<ParentSettings>(loadSettings);
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);
  const [activeTab, setActiveTab] = useState<'game' | 'dashboard' | 'badges'>('game');
  const [isParentPortalOpen, setIsParentPortalOpen] = useState(false);
  const [unlockedBadgesQueue, setUnlockedBadgesQueue] = useState<string[]>([]);

  // Persist settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Persist profile whenever it changes
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const handleUpdateProfile = (newProfile: StudentProfile, newlyUnlockedBadges: string[]) => {
    setProfile(newProfile);
    if (newlyUnlockedBadges.length > 0) {
      setUnlockedBadgesQueue(prev => [...prev, ...newlyUnlockedBadges]);
    }
  };

  const handleToggleSound = () => {
    const newSoundState = !(settings.soundEffects || settings.voiceFeedback);
    const updated = {
      ...settings,
      soundEffects: newSoundState,
      voiceFeedback: newSoundState
    };
    setSettings(updated);
    if (newSoundState) {
      playSound('pop');
    }
  };

  const handleSelectAvatar = (avatarId: string) => {
    const updated = { ...profile, avatarId };
    setProfile(updated);
  };

  const handleResetProgress = () => {
    const freshProfile = resetProfile();
    setProfile(freshProfile);
    playSound('pop');
  };

  const handleCloseBadgeModal = () => {
    setUnlockedBadgesQueue(prev => prev.slice(1));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col selection:bg-amber-200">
      {/* Header Bar */}
      <HeaderNav
        profile={profile}
        settings={settings}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          playSound('click');
          setActiveTab(tab);
        }}
        onToggleSound={handleToggleSound}
        onOpenParentPortal={() => {
          playSound('click');
          setIsParentPortalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-12">
        {activeTab === 'game' && (
          <GameView
            settings={settings}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView profile={profile} />
        )}

        {activeTab === 'badges' && (
          <BadgesView
            profile={profile}
            onSelectAvatar={handleSelectAvatar}
          />
        )}
      </main>

      {/* Parent Portal Modal */}
      <ParentPortalModal
        isOpen={isParentPortalOpen}
        onClose={() => setIsParentPortalOpen(false)}
        settings={settings}
        profile={profile}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        onResetProgress={handleResetProgress}
      />

      {/* Celebratory Badge Unlock Popup */}
      <BadgeUnlockModal
        badgeIds={unlockedBadgesQueue}
        onClose={handleCloseBadgeModal}
      />
    </div>
  );
}
