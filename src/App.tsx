import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LearningHub from './components/LearningHub';
import Garden from './components/Garden';
import Leaderboard from './pages/Leaderboard';
import Community from './pages/Community';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Auth from './components/Auth';
import { User, Challenge, Tree, LeaderboardEntry, CommunityPost } from './types';
import { useAuth } from './context/AuthContext';
import RequireRole from './components/auth/RequireRole';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const { user: authUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && (currentPage === 'auth' || currentPage === 'home')) {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated]);

  // Mock data - in a real app, this would come from a backend/database
  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Build a Todo App with React',
      description: 'Create a fully functional todo application with add, delete, and mark complete features.',
      difficulty: 'beginner',
      category: 'web-dev',
      reward: 50,
      completed: true,
      timeEstimate: '2-3 hours'
    },
    {
      id: '2',
      title: 'API Integration Challenge',
      description: 'Connect to a REST API and display dynamic data with error handling.',
      difficulty: 'intermediate',
      category: 'web-dev',
      reward: 75,
      completed: false,
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
    }
  ];

  const mockTrees: Tree[] = [
    {
      id: '1',
      name: 'React Fundamentals',
      category: 'Web Development',
      growthStage: 'tree',
      plantedAt: new Date('2024-01-15'),
      waterDropsInvested: 150
    },
    {
      id: '2',
      name: 'JavaScript ES6',
      category: 'Programming',
      growthStage: 'sapling',
      plantedAt: new Date('2024-02-01'),
      waterDropsInvested: 75
    }
  ];

  const mockUser: User = {
    id: 'user-1',
    name: 'Alex Developer',
    email: 'alex@example.com',
    waterDrops: 275,
    level: 3,
    joinedAt: new Date('2024-01-01'),
    garden: mockTrees
  };

  const mockLeaderboard: LeaderboardEntry[] = [
    {
      user: { ...mockUser, name: 'Sarah Chen' },
      totalDrops: 1250,
      treesGrown: 12,
      rank: 1,
      weeklyGrowth: 150
    },
    {
      user: { ...mockUser, name: 'Alex Developer' },
      totalDrops: 1100,
      treesGrown: 8,
      rank: 2,
      weeklyGrowth: 120
    },
    {
      user: { ...mockUser, name: 'Maria Garcia' },
      totalDrops: 950,
      treesGrown: 7,
      rank: 3,
      weeklyGrowth: 100
    },
    {
      user: { ...mockUser, name: 'David Kim' },
      totalDrops: 800,
      treesGrown: 6,
      rank: 4,
      weeklyGrowth: 80
    },
    {
      user: { ...mockUser, name: 'Emma Wilson' },
      totalDrops: 750,
      treesGrown: 5,
      rank: 5,
      weeklyGrowth: 70
    }
  ];

  const mockCommunityPosts: CommunityPost[] = [
    {
      id: '1',
      user: mockLeaderboard[0].user,
      content: "Just completed my first full-stack web application! The journey from struggling with basic HTML to building a complete React app with Node.js backend feels incredible. CodeBurry's hands-on challenges made all the difference! 🌱",
      achievement: "Full-Stack Web Developer",
      likes: 24,
      comments: 8,
      createdAt: new Date('2024-12-26T10:30:00')
    },
    {
      id: '2',
      user: mockLeaderboard[2].user,
      content: "Python data analysis challenge completed! Created my first machine learning model that predicts house prices with 87% accuracy. The step-by-step approach really helped me understand each concept.",
      likes: 18,
      comments: 5,
      createdAt: new Date('2024-12-26T08:15:00')
    },
    {
      id: '3',
      user: mockLeaderboard[3].user,
      content: "My garden is growing! 🌳 Just planted my 6th tree after mastering JavaScript closures. Each tree represents hours of active learning and problem-solving. This gamified approach makes learning so much more engaging!",
      likes: 31,
      comments: 12,
      createdAt: new Date('2024-12-25T19:45:00')
    }
  ];

  const handleStartChallenge = (challenge: Challenge) => {
    // Mock challenge start - in a real app, this would update the backend
    console.log('Starting challenge:', challenge.title);
    // For demo purposes, just show an alert
    alert(`Starting challenge: ${challenge.title}\n\nThis would normally open the challenge interface where you can work on the task actively!`);
  };

  const handleWaterTree = (treeId: string) => {
    // Keeping demo interactions unchanged
    const tree = mockTrees.find(t => t.id === treeId);
    if (tree) {
      alert(`🌱 Tree watered! Your ${tree.name} is growing stronger.`);
    }
  };

  const handlePlantNewTree = () => {
    alert('🌱 Complete more challenges to plant new trees in your garden!');
  };

  const handleLikePost = (postId: string) => {
    console.log('Liking post:', postId);
  };

  const handleCreatePost = (content: string, achievement?: string) => {
    console.log('Creating post:', { content, achievement });
    alert('Post created! Your learning journey has been shared with the community. 🌟');
  };

  const handleNavigate = (page: string) => {
    if (page === 'auth' && isAuthenticated) {
      setCurrentPage('dashboard');
    } else if ((page === 'dashboard' || page === 'garden' || page === 'admin') && !isAuthenticated) {
      setCurrentPage('auth');
    } else {
      setCurrentPage(page);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentPage('learning');
    } else {
      setCurrentPage('auth');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Hero 
            onGetStarted={handleGetStarted}
            onWatchDemo={() => alert('🎥 Demo video would play here! For now, explore the platform to see CodeBurry in action.')}
          />
        );
      case 'learning':
        return (
          <LearningHub 
            onStartChallenge={handleStartChallenge}
          />
        );
      case 'garden':
        return isAuthenticated ? (
          <Garden 
            trees={mockTrees}
            waterDrops={275}
            onWaterTree={handleWaterTree}
            onPlantNewTree={handlePlantNewTree}
          />
        ) : (
          <Auth 
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'leaderboard':
        return (
          <Leaderboard />
        );
      case 'community':
        return <Community />;
      case 'dashboard':
        return isAuthenticated ? (
          <Dashboard 
            user={mockUser}
            recentChallenges={mockChallenges}
            onNavigate={handleNavigate}
          />
        ) : (
          <Auth 
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'admin':
        return isAuthenticated ? (
          <RequireRole role="admin">
            <AdminPanel />
          </RequireRole>
        ) : (
          <Auth onBack={() => setCurrentPage('home')} />
        );
      case 'about':
        return (
          <About 
            onGetStarted={handleGetStarted}
          />
        );
      case 'auth':
        return (
          <Auth 
            onBack={() => setCurrentPage('home')}
          />
        );
      default:
        return (
          <Hero 
            onGetStarted={handleGetStarted}
            onWatchDemo={() => alert('🎥 Demo video would play here! For now, explore the platform to see CodeBurry in action.')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage !== 'auth' && (
        <Header 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={isAuthenticated ? mockUser : undefined}
        />
      )}
      {renderCurrentPage()}
    </div>
  );
}

export default App;