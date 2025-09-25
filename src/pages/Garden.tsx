import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const Garden = () => {
  const { user } = useAuth();
  const { stats } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your garden</h2>
          <p className="text-gray-600">You need to be logged in to see your planted trees and achievements.</p>
        </div>
      </div>
    );
  }

  // Generate some demo trees based on user stats
  const trees = Array.from({ length: stats.totalTrees }, (_, index) => ({
    id: index + 1,
    type: ['🌳', '🌲', '🌴', '🎄'][index % 4],
    name: ['Oak Tree', 'Pine Tree', 'Palm Tree', 'Christmas Tree'][index % 4],
    plantedDate: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString()
  }));

  // Add placeholder spots for future trees
  const totalSpots = 12;
  const emptySpots = Math.max(0, totalSpots - stats.totalTrees);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            🌿 {user.name}'s Garden 🌿
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to your virtual garden! Each tree represents a milestone in your learning journey. 
            Complete lessons, grow plants, and watch your garden flourish!
          </p>
        </div>

        {/* Garden Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalTrees}</div>
              <div className="text-gray-600">Trees Planted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.waterDrops}</div>
              <div className="text-gray-600">Water Drops Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.completedLessons}</div>
              <div className="text-gray-600">Lessons Completed</div>
            </div>
          </div>
        </motion.div>

        {/* Garden Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Virtual Garden</h2>
          
          {stats.totalTrees === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🌱</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Your garden is waiting to grow!</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Complete lessons to earn water drops, then use them to grow your first plant into a beautiful tree.
              </p>
              <div className="text-4xl">💧 ➡️ 🌱 ➡️ 🌳</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Planted Trees */}
              {trees.map((tree, index) => (
                <motion.div
                  key={tree.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center border-2 border-green-200 shadow-md"
                >
                  <div className="text-6xl mb-3">{tree.type}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tree.name}</h3>
                  <p className="text-sm text-gray-600">Planted on</p>
                  <p className="text-sm font-medium text-green-600">{tree.plantedDate}</p>
                </motion.div>
              ))}

              {/* Empty Spots */}
              {Array.from({ length: emptySpots }, (_, index) => (
                <motion.div
                  key={`empty-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * (trees.length + index) }}
                  className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-gray-300 hover:border-green-300 transition-colors"
                >
                  <div className="text-6xl mb-3 opacity-30">🌱</div>
                  <h3 className="font-semibold text-gray-400 mb-2">Empty Spot</h3>
                  <p className="text-sm text-gray-400">Complete more lessons to plant here!</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Growth Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">🌿 Garden Growing Tips 🌿</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">📚</div>
              <h4 className="font-semibold mb-2">Complete Lessons</h4>
              <p className="text-green-100 text-sm">Each lesson gives you 5 water drops to help your plants grow.</p>
            </div>
            <div>
              <div className="text-4xl mb-2">💧</div>
              <h4 className="font-semibold mb-2">Water Regularly</h4>
              <p className="text-green-100 text-sm">Use water drops to help your plant grow from seedling to tree.</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🌳</div>
              <h4 className="font-semibold mb-2">Plant Trees</h4>
              <p className="text-green-100 text-sm">When your plant reaches 100%, it becomes a tree in your garden!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Garden;