import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Heart, 
  User,
  Calendar,
  Award,
  Star
} from 'lucide-react';
import { Article } from '../types';
import { articlesService } from '../services/articlesService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { mockArticles } from '../data/mockData';

const TrendingPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        setLoading(true);
        const data = await articlesService.getAllArticles();
        const validArticles = Array.isArray(data) ? data : [...mockArticles];
        
        // Sort by trending metrics (likes for now, could be more sophisticated)
        const trendingArticles = validArticles
          .filter(article => article.status === 'published')
          .sort((a, b) => {
            // Simple trending algorithm: likes + recency
            const aScore = a.likes + (new Date().getTime() - new Date(a.createdAt).getTime()) / 86400000;
            const bScore = b.likes + (new Date().getTime() - new Date(b.createdAt).getTime()) / 86400000;
            return bScore - aScore;
          });
        
        setArticles(trendingArticles);
      } catch (err) {
        console.error('Error fetching trending articles:', err);
        setArticles([...mockArticles].filter(a => a.status === 'published'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingArticles();
  }, [timeFrame]);

  const handleLike = async (articleId: string) => {
    if (!isAuthenticated) return;

    try {
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { 
              ...article, 
              isLiked: !article.isLiked,
              likes: article.isLiked ? article.likes - 1 : article.likes + 1
            }
          : article
      ));

      const article = articles.find(a => a.id === articleId);
      if (article?.isLiked) {
        await articlesService.unlikeArticle(articleId);
      } else {
        await articlesService.likeArticle(articleId);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const getTrendingRank = (index: number) => {
    if (index === 0) return { icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (index === 1) return { icon: Star, color: 'text-gray-500', bg: 'bg-gray-50' };
    if (index === 2) return { icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' };
    return { icon: TrendingUp, color: 'text-primary-500', bg: 'bg-primary-50' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trending stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Flame className="h-8 w-8 mr-3" />
              <h1 className="text-4xl font-bold">Trending Stories</h1>
            </div>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Discover the hottest stories that are capturing readers' attention right now
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Filter */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {[
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
              { key: 'all', label: 'All Time' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setTimeFrame(option.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  timeFrame === option.key
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Articles */}
        {articles.length > 0 ? (
          <div className="space-y-6">
            {/* Top 3 Featured */}
            {articles.slice(0, 3).map((article, index) => {
              const rank = getTrendingRank(index);
              const RankIcon = rank.icon;
              
              return (
                <div key={article.id} className="card card-elevated overflow-hidden">
                  <div className="flex">
                    {/* Rank Indicator */}
                    <div className={`flex items-center justify-center w-16 ${rank.bg}`}>
                      <div className="text-center">
                        <RankIcon className={`h-6 w-6 ${rank.color} mx-auto mb-1`} />
                        <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <span className="badge badge-error">
                              <Flame className="h-3 w-3 mr-1" />
                              Trending
                            </span>
                            <div className="flex items-center ml-4 text-sm text-gray-500">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {article.likes} reactions
                            </div>
                          </div>
                          
                          <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            <Link 
                              to={`/article/${article.id}`}
                              className="hover:text-red-600 transition-colors duration-200"
                            >
                              {article.title}
                            </Link>
                          </h2>
                          
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {article.content.slice(0, 200)}...
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-gray-500 text-sm">
                                <User className="h-4 w-4 mr-1" />
                                {article.author.firstName} {article.author.lastName}
                              </div>
                              <div className="flex items-center text-gray-500 text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                {format(new Date(article.createdAt), 'MMM d, yyyy')}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleLike(article.id)}
                                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                  article.isLiked
                                    ? 'text-red-600 bg-red-50'
                                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                }`}
                                disabled={!isAuthenticated}
                              >
                                <Heart className={`h-4 w-4 ${article.isLiked ? 'fill-current' : ''}`} />
                                <span className="text-sm font-medium">{article.likes}</span>
                              </button>
                              
                              <Link
                                to={`/article/${article.id}`}
                                className="btn btn-secondary btn-sm"
                              >
                                Read Story
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Rest of the articles */}
            {articles.slice(3).length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                  More Trending Stories
                </h3>
                
                <div className="grid-responsive">
                  {articles.slice(3).map((article, index) => (
                    <article key={article.id} className="card p-6 group hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-400 mr-2">
                            #{index + 4}
                          </span>
                          <span className="badge badge-warning">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Rising
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleLike(article.id)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                            article.isLiked
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                          disabled={!isAuthenticated}
                        >
                          <Heart className={`h-4 w-4 ${article.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{article.likes}</span>
                        </button>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        <Link 
                          to={`/article/${article.id}`} 
                          className="hover:text-red-600 transition-colors duration-200"
                        >
                          {article.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {article.content.slice(0, 120)}...
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-gray-500 text-sm">
                            <User className="h-4 w-4 mr-1" />
                            {article.author.firstName} {article.author.lastName}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(new Date(article.createdAt), 'MMM d')}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trending stories</h3>
            <p className="text-gray-600 mb-6">
              Check back later to see what stories are gaining popularity.
            </p>
            <Link to="/explore" className="btn btn-primary">
              Explore All Stories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
