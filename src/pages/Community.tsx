import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Crown, 
  Star, 
  BookOpen, 
  MessageCircle,
  Award,
  Calendar,
  TrendingUp,
  Heart,
  Edit,
  Trophy
} from 'lucide-react';
import { User, Article } from '../types';
import { articlesService } from '../services/articlesService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { mockArticles } from '../data/mockData';

interface CommunityStats {
  totalUsers: number;
  totalArticles: number;
  totalLikes: number;
  activeWriters: number;
}

interface TopWriter extends User {
  articlesCount: number;
  totalLikes: number;
  rank: number;
}

const CommunityPage: React.FC = () => {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [topWriters, setTopWriters] = useState<TopWriter[]>([]);
  const [stats, setStats] = useState<CommunityStats>({
    totalUsers: 0,
    totalArticles: 0,
    totalLikes: 0,
    activeWriters: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        const articles = await articlesService.getAllArticles();
        const validArticles = Array.isArray(articles) ? articles : [...mockArticles];
        
        // Get recent articles
        const recent = validArticles
          .filter(article => article.status === 'published')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentArticles(recent);

        // Calculate stats
        const totalLikes = validArticles.reduce((sum, article) => sum + article.likes, 0);
        const uniqueAuthors = new Set(validArticles.map(article => article.author.id));
        
        setStats({
          totalUsers: 5234, // Mock data
          totalArticles: validArticles.length,
          totalLikes,
          activeWriters: uniqueAuthors.size
        });

        // Get top writers (mock data for now)
        const writers: TopWriter[] = [
          {
            id: '1',
            email: 'jane.doe@example.com',
            username: 'jane_writer',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'user',
            articlesCount: 15,
            totalLikes: 342,
            rank: 1
          },
          {
            id: '2',
            email: 'john.smith@example.com',
            username: 'john_stories',
            firstName: 'John',
            lastName: 'Smith',
            role: 'user',
            articlesCount: 12,
            totalLikes: 289,
            rank: 2
          },
          {
            id: '3',
            email: 'alice.writer@example.com',
            username: 'alice_creative',
            firstName: 'Alice',
            lastName: 'Johnson',
            role: 'user',
            articlesCount: 10,
            totalLikes: 234,
            rank: 3
          },
          {
            id: '4',
            email: 'mike.author@example.com',
            username: 'mike_tales',
            firstName: 'Mike',
            lastName: 'Wilson',
            role: 'user',
            articlesCount: 8,
            totalLikes: 198,
            rank: 4
          },
          {
            id: '5',
            email: 'sara.novelist@example.com',
            username: 'sara_stories',
            firstName: 'Sara',
            lastName: 'Brown',
            role: 'user',
            articlesCount: 7,
            totalLikes: 167,
            rank: 5
          }
        ];
        setTopWriters(writers);
      } catch (err) {
        console.error('Error fetching community data:', err);
        setRecentArticles([...mockArticles].slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50' };
      case 2: return { icon: Award, color: 'text-gray-500', bg: 'bg-gray-50' };
      case 3: return { icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-50' };
      default: return { icon: Star, color: 'text-primary-500', bg: 'bg-primary-50' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 mr-3" />
              <h1 className="text-4xl font-bold">Community</h1>
            </div>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Connect with fellow writers and readers in our vibrant creative community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalArticles}</div>
            <div className="text-sm text-gray-600">Stories Published</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Edit className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeWriters}</div>
            <div className="text-sm text-gray-600">Active Writers</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Writers */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="flex items-center mb-6">
                <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Top Writers</h2>
              </div>
              
              <div className="space-y-4">
                {topWriters.map((writer) => {
                  const rankInfo = getRankIcon(writer.rank);
                  const RankIcon = rankInfo.icon;
                  
                  return (
                    <div key={writer.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className={`w-10 h-10 ${rankInfo.bg} rounded-full flex items-center justify-center`}>
                        <RankIcon className={`h-5 w-5 ${rankInfo.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">
                            {writer.firstName} {writer.lastName}
                          </h3>
                          <span className="text-sm text-gray-500">#{writer.rank}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{writer.articlesCount} stories</span>
                          <span>{writer.totalLikes} likes</span>
                        </div>
                      </div>
                      
                      {writer.id === user?.id && (
                        <span className="badge badge-primary text-xs">You</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link to="/leaderboard" className="btn btn-ghost w-full">
                  View Full Leaderboard
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Community Activity */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                </div>
                <Link to="/explore" className="btn btn-ghost btn-sm">
                  View All
                </Link>
              </div>
              
              <div className="space-y-6">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {article.author.firstName} {article.author.lastName}
                        </h3>
                        <span className="text-sm text-gray-500">published a new story</span>
                      </div>
                      
                      <Link 
                        to={`/article/${article.id}`}
                        className="font-medium text-primary-600 hover:text-primary-700 line-clamp-1"
                      >
                        {article.title}
                      </Link>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {article.content.slice(0, 100)}...
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(article.createdAt), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {article.likes} likes
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          0 comments
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Join Community CTA */}
        {!isAuthenticated && (
          <div className="mt-12 card p-8 text-center bg-gradient-to-r from-purple-50 to-primary-50 border-purple-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Become part of our vibrant community of writers and readers. Share your stories, 
              discover new voices, and connect with fellow creatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg">
                <UserPlus className="h-5 w-5 mr-2" />
                Join Community
              </Link>
              <Link to="/explore" className="btn btn-secondary btn-lg">
                Explore Stories
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
