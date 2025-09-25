import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface UserStats {
  waterDrops: number;
  completedLessons: number;
  currentStreak: number;
  totalTrees: number;
  plantGrowthLevel: number;
  rank: number;
}

interface UserContextType {
  stats: UserStats;
  addWaterDrops: (amount: number) => void;
  spendWaterDrops: (amount: number) => boolean;
  completeLesson: () => void;
  waterPlant: (amount: number) => boolean;
  plantTree: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    waterDrops: 0,
    completedLessons: 0,
    currentStreak: 0,
    totalTrees: 0,
    plantGrowthLevel: 0,
    rank: 1
  });

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const res = await fetch('/api/me/leaderboard', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setStats((prev) => ({
              ...prev,
              waterDrops: data.stats?.drops ?? 0,
              completedLessons: data.stats?.lessonsCompleted ?? 0,
              currentStreak: data.stats?.streak ?? 0,
            }));
          }
        } catch {}
      })();
    }
  }, [isAuthenticated]);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
  };

  const addWaterDrops = async (amount: number) => {
    const updated = { ...stats, waterDrops: stats.waterDrops + amount };
    saveStats(updated);
    if (isAuthenticated) {
      try {
        await fetch('/api/me/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ drops: amount })
        });
      } catch {}
    }
  };

  const spendWaterDrops = (amount: number): boolean => {
    if (stats.waterDrops >= amount) {
      const updated = { ...stats, waterDrops: stats.waterDrops - amount };
      saveStats(updated);
      // Spending does not decrement leaderboard drops; only earning increments
      return true;
    }
    return false;
  };

  const completeLesson = async () => {
    const newStats = {
      ...stats,
      completedLessons: stats.completedLessons + 1,
      currentStreak: stats.currentStreak + 1
    };
    saveStats(newStats);
    await addWaterDrops(5);
    if (isAuthenticated) {
      try {
        await fetch('/api/me/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ lessons: 1, streakDelta: 1 })
        });
      } catch {}
    }
  };

  const waterPlant = (amount: number): boolean => {
    if (spendWaterDrops(amount)) {
      const newGrowthLevel = Math.min(100, stats.plantGrowthLevel + amount * 2);
      saveStats({ ...stats, plantGrowthLevel: newGrowthLevel });
      return true;
    }
    return false;
  };

  const plantTree = () => {
    if (stats.plantGrowthLevel >= 100) {
      saveStats({
        ...stats,
        totalTrees: stats.totalTrees + 1,
        plantGrowthLevel: 0
      });
    }
  };

  return (
    <UserContext.Provider value={{
      stats,
      addWaterDrops,
      spendWaterDrops,
      completeLesson,
      waterPlant,
      plantTree
    }}>
      {children}
    </UserContext.Provider>
  );
};