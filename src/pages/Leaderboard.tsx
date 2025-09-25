import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, FireIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'drops' | 'lessons' | 'streak'>('drops');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<Array<{ id: string; name: string; avatar?: string | null; score: number; rank: number }>>([]);

  const byParam = useMemo(() => {
    if (activeTab === 'lessons') return 'lessons';
    if (activeTab === 'streak') return 'streak';
    return 'drops';
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:4000/api/leaderboard?by=${byParam}&limit=50`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load leaderboard');
        const data = await res.json();
        if (cancelled) return;
        const mapped = (data.entries || []).map((e: any) => ({
          id: e.user?.id || e.userId || String(Math.random()),
          name: e.user?.name || 'Unknown',
          avatar: e.user?.avatar || null,
          score: activeTab === 'lessons' ? e.lessons : activeTab === 'streak' ? e.streak : e.drops,
          rank: e.rank,
        }));
        setEntries(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [byParam, activeTab]);

  const tabs = [
    { key: 'drops', label: 'Water Drops', icon: '💧', color: 'blue' },
    { key: 'lessons', label: 'Lessons', icon: AcademicCapIcon, color: 'green' },
    { key: 'streak', label: 'Streak', icon: FireIcon, color: 'orange' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-600 bg-yellow-50';
      case 2:
        return 'text-gray-600 bg-gray-50';
      case 3:
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const currentData = entries;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            🏆 Leaderboard 🏆
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how you stack up against other CodeBurry learners! 
            Compete in different categories and climb the ranks.
          </p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="flex flex-col sm:flex-row">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-green-600 text-white rounded-xl m-2'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                } flex items-center justify-center space-x-2`}
              >
                {typeof tab.icon === 'string' ? (
                  <span className="text-xl">{tab.icon}</span>
                ) : (
                  <tab.icon className="h-5 w-5" />
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
              <span>Top Performers - {tabs.find(t => t.key === activeTab)?.label}</span>
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {loading && (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            )}
            {error && !loading && (
              <div className="p-6 text-center text-red-600">{error}</div>
            )}
            {!loading && !error && currentData
              .slice()
              .sort((a, b) => b.score - a.score)
              .map((user, index) => {
                const actualRank = index + 1;
                const isCurrentUser = false;
                
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
                      isCurrentUser ? 'bg-green-50 border-l-4 border-green-500' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getRankColor(actualRank)}`}>
                      {getRankIcon(actualRank)}
                    </div>

                    {/* Avatar */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isCurrentUser ? 'text-green-700' : 'text-gray-900'}`}>
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activeTab === 'drops' && `${user.score} water drops`}
                        {activeTab === 'lessons' && `${user.score} lessons completed`}
                        {activeTab === 'streak' && `${user.score} day streak`}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        activeTab === 'drops' ? 'text-blue-600' :
                        activeTab === 'lessons' ? 'text-green-600' :
                        'text-orange-600'
                      }`}>
                        {user.score}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activeTab === 'drops' && '💧'}
                        {activeTab === 'lessons' && '📚'}
                        {activeTab === 'streak' && '🔥'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

        {/* Motivational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Keep Learning, Keep Growing! 🌱</h3>
          <p className="text-green-100 mb-6">
            Every lesson you complete brings you closer to the top. Remember, the best time to plant a tree was 20 years ago. 
            The second best time is now!
          </p>
          <div className="text-4xl">🚀📚💧🌳🏆</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;