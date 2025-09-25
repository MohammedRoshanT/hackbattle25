import React, { useState } from 'react';
import { Code, Globe, Database, Brain, Clock, Trophy, ChevronRight, Droplets } from 'lucide-react';
import { Challenge } from '../types';

interface LearningHubProps {
  onStartChallenge: (challenge: Challenge) => void;
}

export default function LearningHub({ onStartChallenge }: LearningHubProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startedById, setStartedById] = useState<Record<string, boolean>>({});
  const [completedById, setCompletedById] = useState<Record<string, boolean>>({});
  const [uploadById, setUploadById] = useState<Record<string, File | null>>({});
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [uploadingById, setUploadingById] = useState<Record<string, boolean>>({});
  const [errorById, setErrorById] = useState<Record<string, string | null>>({});

  // Load existing submissions to persist UI state
  React.useEffect(() => {
    (async () => {
      try {
        setLoadingSubs(true);
        const res = await fetch('/api/me/submissions', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const started: Record<string, boolean> = {};
          const completed: Record<string, boolean> = {};
          (data.submissions || []).forEach((s: any) => {
            started[s.challengeId] = true;
            if (s.status === 'approved') completed[s.challengeId] = true;
          });
          setStartedById(started);
          setCompletedById(completed);
        }
      } finally {
        setLoadingSubs(false);
      }
    })();
  }, []);

  const categories = [
    { id: 'all', name: 'All Challenges', icon: Brain },
    { id: 'web-dev', name: 'Web Development', icon: Globe },
    { id: 'python', name: 'Python', icon: Code },
    { id: 'database', name: 'Databases', icon: Database },
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Build a Todo App with React',
      description: 'Create a fully functional todo application with add, delete, and mark complete features.',
      difficulty: 'beginner',
      category: 'web-dev',
      reward: 50,
      completed: false,
      timeEstimate: '2-3 hours'
    },
    {
      id: '2',
      title: 'API Integration Challenge',
      description: 'Connect to a REST API and display dynamic data with error handling.',
      difficulty: 'intermediate',
      category: 'web-dev',
      reward: 75,
      completed: true,
      timeEstimate: '3-4 hours'
    },
    {
      id: '3',
      title: 'Python Data Analysis',
      description: 'Analyze a dataset using pandas and create visualizations with matplotlib.',
      difficulty: 'intermediate',
      category: 'python',
      reward: 80,
      completed: false,
      timeEstimate: '4-5 hours'
    },
    {
      id: '4',
      title: 'Database Design Challenge',
      description: 'Design and implement a relational database schema for an e-commerce system.',
      difficulty: 'advanced',
      category: 'database',
      reward: 100,
      completed: false,
      timeEstimate: '5-6 hours'
    },
    {
      id: '5',
      title: 'Machine Learning Basics',
      description: 'Build your first ML model to predict house prices using scikit-learn.',
      difficulty: 'advanced',
      category: 'python',
      reward: 120,
      completed: false,
      timeEstimate: '6-8 hours'
    },
    {
      id: '6',
      title: 'Responsive Web Design',
      description: 'Create a mobile-first, fully responsive website using CSS Grid and Flexbox.',
      difficulty: 'beginner',
      category: 'web-dev',
      reward: 45,
      completed: false,
      timeEstimate: '2-3 hours'
    }
  ];

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Active Learning Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your knowledge through hands-on challenges. Every completed task grows your skills 
            and earns water drops to nurture your learning forest.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                (completedById[challenge.id] || challenge.completed) ? 'ring-2 ring-green-200' : ''
              }`}
            >
              <div className="p-6">
                {/* Challenge Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{challenge.description}</p>
                  </div>
                  {(completedById[challenge.id] || challenge.completed) && (
                    <div className="ml-4">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Challenge Metadata */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{challenge.timeEstimate}</span>
                  </span>
                </div>

                {/* Reward and Action */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span className="text-lg font-bold text-blue-600">+{challenge.reward}</span>
                    <span className="text-sm text-gray-500">drops</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setStartedById(prev => ({ ...prev, [challenge.id]: true }));
                      onStartChallenge(challenge);
                    }}
                    disabled={completedById[challenge.id] || challenge.completed}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      (completedById[challenge.id] || challenge.completed)
                        ? 'bg-green-100 text-green-600 cursor-not-allowed'
                        : startedById[challenge.id]
                          ? 'bg-yellow-100 text-yellow-700 cursor-default'
                          : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    <span>{(completedById[challenge.id] || challenge.completed) ? 'Completed' : startedById[challenge.id] ? 'Started' : 'Start Challenge'}</span>
                    {!(completedById[challenge.id] || challenge.completed) && !startedById[challenge.id] && <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>

                {/* Upload panel once started and not yet completed */}
                {startedById[challenge.id] && !(completedById[challenge.id] || challenge.completed) && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="text-sm text-gray-700 mb-2">Upload your task files when completed:</div>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                        setUploadById(prev => ({ ...prev, [challenge.id]: file }));
                      }}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={async () => {
                          const file = uploadById[challenge.id];
                          if (!file) return;
                          setErrorById(prev => ({ ...prev, [challenge.id]: null }));
                          setUploadingById(prev => ({ ...prev, [challenge.id]: true }));
                          const form = new FormData();
                          form.append('file', file);
                          form.append('challengeTitle', challenge.title);
                          const res = await fetch(`/api/challenges/${challenge.id}/upload`, {
                            method: 'POST',
                            credentials: 'include',
                            body: form
                          });
                          if (res.ok) {
                            // Mark as submitted (not completed yet). Admin approval will award drops.
                            setStartedById(prev => ({ ...prev, [challenge.id]: true }));
                            // Optionally re-fetch submissions to check status
                          } else {
                            let msg = 'Failed to submit task';
                            try { const j = await res.json(); if (j?.message) msg = j.message; } catch {}
                            setErrorById(prev => ({ ...prev, [challenge.id]: msg }));
                          }
                          setUploadingById(prev => ({ ...prev, [challenge.id]: false }));
                        }}
                        disabled={!uploadById[challenge.id] || uploadingById[challenge.id]}
                        className={`px-4 py-2 rounded-lg font-medium ${uploadById[challenge.id] && !uploadingById[challenge.id] ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                      >
                        {uploadingById[challenge.id] ? 'Uploading…' : 'Upload Task'}
                      </button>
                      {errorById[challenge.id] && (
                        <div className="ml-3 text-sm text-red-600">{errorById[challenge.id]}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to grow your forest?</h2>
            <p className="text-xl opacity-90 mb-6">
              Complete challenges, earn water drops, and watch your skills bloom into mighty trees.
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
              View My Garden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}