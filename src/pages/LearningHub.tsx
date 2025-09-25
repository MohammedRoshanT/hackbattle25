import React, { useState } from 'react';
import { Code, Globe, Database, Brain, Clock, Trophy, ChevronRight, Droplets, Plus, Upload, FileText, Play, CheckCircle } from 'lucide-react';
import { Challenge } from '../types';
import TaskUploadModal from './TaskUploadModal';
import TaskCompletionModal from './TaskCompletionModal';

interface LearningHubProps {
  onStartChallenge: (challenge: Challenge) => void;
}

interface UploadedTask {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  timeEstimate: string;
  file?: File;
  fileName?: string;
}

export default function LearningHub({ onStartChallenge }: LearningHubProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedTasks, setUploadedTasks] = useState<Challenge[]>([]);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const categories = [
    { id: 'all', name: 'All Challenges', icon: Brain },
    { id: 'web-dev', name: 'Web Development', icon: Globe },
    { id: 'python', name: 'Python', icon: Code },
    { id: 'database', name: 'Databases', icon: Database },
    { id: 'mobile', name: 'Mobile Development', icon: Code },
    { id: 'ai-ml', name: 'AI & Machine Learning', icon: Brain },
    { id: 'devops', name: 'DevOps', icon: Database },
  ];

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Build a Todo App with React',
      description: 'Create a fully functional todo application with add, delete, and mark complete features.',
      difficulty: 'beginner',
      category: 'web-dev',
      reward: 50,
      completed: false,
      timeEstimate: '2-3 hours',
      status: 'not_started'
    },
    {
      id: '2',
      title: 'API Integration Challenge',
      description: 'Connect to a REST API and display dynamic data with error handling.',
      difficulty: 'intermediate',
      category: 'web-dev',
      reward: 75,
      completed: true,
      timeEstimate: '3-4 hours',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Python Data Analysis',
      description: 'Analyze a dataset using pandas and create visualizations with matplotlib.',
      difficulty: 'intermediate',
      category: 'python',
      reward: 80,
      completed: false,
      timeEstimate: '4-5 hours',
      status: 'not_started'
    },
    {
      id: '4',
      title: 'Database Design Challenge',
      description: 'Design and implement a relational database schema for an e-commerce system.',
      difficulty: 'advanced',
      category: 'database',
      reward: 100,
      completed: false,
      timeEstimate: '5-6 hours',
      status: 'not_started'
    },
    {
      id: '5',
      title: 'Machine Learning Basics',
      description: 'Build your first ML model to predict house prices using scikit-learn.',
      difficulty: 'advanced',
      category: 'python',
      reward: 120,
      completed: false,
      timeEstimate: '6-8 hours',
      status: 'not_started'
    },
    {
      id: '6',
      title: 'Responsive Web Design',
      description: 'Create a mobile-first, fully responsive website using CSS Grid and Flexbox.',
      difficulty: 'beginner',
      category: 'web-dev',
      reward: 45,
      completed: false,
      timeEstimate: '2-3 hours',
      status: 'not_started'
    }
  ]);

  const allChallenges = [...challenges, ...uploadedTasks];
  
  const filteredChallenges = selectedCategory === 'all' 
    ? allChallenges 
    : allChallenges.filter(c => c.category === selectedCategory);

  const handleUploadTask = (taskData: UploadedTask) => {
    const newChallenge: Challenge = {
      id: `uploaded-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      difficulty: taskData.difficulty,
      category: taskData.category,
      reward: taskData.difficulty === 'beginner' ? 40 : taskData.difficulty === 'intermediate' ? 60 : 80,
      completed: false,
      timeEstimate: taskData.timeEstimate,
      fileName: taskData.fileName,
      isUploaded: true,
      status: 'not_started'
    };

    setUploadedTasks(prev => [...prev, newChallenge]);
    alert(`Task "${taskData.title}" uploaded successfully! You can now start working on it.`);
  };

  const handleStartChallenge = (challenge: Challenge) => {
    // Update challenge status to 'started'
    if (challenge.isUploaded) {
      setUploadedTasks(prev => 
        prev.map(task => 
          task.id === challenge.id 
            ? { ...task, status: 'started' }
            : task
        )
      );
    } else {
      setChallenges(prev => 
        prev.map(task => 
          task.id === challenge.id 
            ? { ...task, status: 'started' }
            : task
        )
      );
    }

    // Call the original handler
    onStartChallenge({ ...challenge, status: 'started' });
  };

  const handleSubmitCompletion = async (challengeId: string, completionFile: File) => {
    // Update challenge to completed status
    const challengeToUpdate = allChallenges.find(c => c.id === challengeId);
    if (!challengeToUpdate) return;

    const updatedChallenge = {
      ...challengeToUpdate,
      status: 'completed' as const,
      completed: true,
      completionFile,
      completionFileName: completionFile.name
    };

    if (challengeToUpdate.isUploaded) {
      setUploadedTasks(prev => 
        prev.map(task => 
          task.id === challengeId 
            ? updatedChallenge
            : task
        )
      );
    } else {
      setChallenges(prev => 
        prev.map(task => 
          task.id === challengeId 
            ? updatedChallenge
            : task
        )
      );
    }

    // Show success message
    alert(`🎉 Congratulations! You've completed "${challengeToUpdate.title}". You earned ${challengeToUpdate.reward} water drops!`);
  };

  const handleOpenCompletionModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsCompletionModalOpen(true);
  };

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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your knowledge through hands-on challenges. Every completed task grows your skills 
            and earns water drops to nurture your learning forest.
          </p>
          
          {/* Upload Task Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Upload className="h-6 w-6" />
              <span>Upload Your Task</span>
            </button>
          </div>
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
                challenge.completed ? 'ring-2 ring-green-200' : ''
              }`}
            >
              <div className="p-6">
                {/* Challenge Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                      {(challenge as any).isUploaded && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Upload className="h-3 w-3 mr-1" />
                          Uploaded
                        </span>
                      )}
                      {challenge.status === 'started' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Play className="h-3 w-3 mr-1" />
                          In Progress
                        </span>
                      )}
                      {challenge.status === 'completed' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{challenge.description}</p>
                    {(challenge as any).fileName && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        File: {(challenge as any).fileName}
                      </p>
                    )}
                  </div>
                  {challenge.completed && (
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
                  
                  {challenge.status === 'not_started' && (
                    <button
                      onClick={() => handleStartChallenge(challenge)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Challenge</span>
                    </button>
                  )}

                  {challenge.status === 'started' && (
                    <button
                      onClick={() => handleOpenCompletionModal(challenge)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Submit Task</span>
                    </button>
                  )}

                  {challenge.status === 'completed' && (
                    <button
                      disabled
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-green-100 text-green-600 cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </button>
                  )}

                  {/* Fallback for challenges without status */}
                  {!challenge.status && (
                    <button
                      onClick={() => challenge.completed ? handleOpenCompletionModal(challenge) : handleStartChallenge(challenge)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        challenge.completed
                          ? 'bg-green-100 text-green-600 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      <span>{challenge.completed ? 'Completed' : 'Start Challenge'}</span>
                      {!challenge.completed && <ChevronRight className="h-4 w-4" />}
                    </button>
                  )}
                </div>
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
      
      {/* Upload Task Modal */}
      <TaskUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadTask}
      />
      
      {/* Task Completion Modal */}
      {selectedChallenge && (
        <TaskCompletionModal
          isOpen={isCompletionModalOpen}
          onClose={() => setIsCompletionModalOpen(false)}
          challenge={selectedChallenge}
          onSubmit={handleSubmitCompletion}
        />
      )}
    </div>
  );
}