import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, User } from 'lucide-react';
import { Article } from '../types';
import { articlesService } from '../services/articlesService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { mockArticles } from '../data/mockData';

// Type guard to ensure we have a valid articles array
const ensureArticlesArray = (data: any): Article[] => {
  if (Array.isArray(data)) {
    return data;
  }
  console.warn('Data is not an array, using mock articles:', data);
  return [...mockArticles];
};

// Articles grid component
interface ArticlesGridProps {
  articles: Article[];
  isAuthenticated: boolean;
  handleLike: (id: string) => void;
}

const ArticlesGrid: React.FC<ArticlesGridProps> = ({ articles, isAuthenticated, handleLike }) => {
  const validArticles = ensureArticlesArray(articles);
  const navigate = useNavigate();

  if (validArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No articles found.</p>
        {isAuthenticated && (
          <Link to="/create" className="btn btn-primary mt-4">
            Write the first article
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {validArticles.map((article) => (
        <article
          key={article.id}
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => navigate(`/article/${article.id}`)}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/article/${article.id}`); }}
          aria-label={`Open article: ${article.title}`}
        >
          <div className="mb-4">
            <span className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {article.title}
            </span>
          </div>
          <div className="text-gray-600 mb-4 line-clamp-3">
            {article.content.length > 150
              ? `${article.content.substring(0, 150)}...`
              : article.content}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{article.author.firstName} {article.author.lastName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-primary-600 group-hover:text-primary-700 font-medium">Read more</span>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <button
                  onClick={e => { e.stopPropagation(); handleLike(article.id); }}
                  className={`flex items-center space-x-1 ${article.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'} transition-colors`}
                >
                  <Heart className={`h-4 w-4 ${article.isLiked ? 'fill-current' : ''}`} />
                  <span>{article.likes}</span>
                </button>
              )}
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span>0</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(ensureArticlesArray(mockArticles));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articlesService.getAllArticles();
      
      // Ensure data is an array using our type guard
      const validArticles = ensureArticlesArray(data);
      setArticles(validArticles);
      
      if (!Array.isArray(data)) {
        setError('Unexpected data format from API. Showing sample content.');
      }
    } catch (err: any) {
      console.error('Error loading articles:', err);
      
      // Always use mock data as fallback to ensure articles is an array
      setArticles(ensureArticlesArray(mockArticles));
      
      // Set appropriate error message
      if (err.code === 'ERR_NETWORK' || err.message?.includes('CORS') || err.response?.status !== 401) {
        setError('Currently showing sample content. API may be temporarily unavailable.');
      } else if (err.response?.status !== 401) {
        setError('Failed to load articles. Showing sample content.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId: string) => {
    if (!isAuthenticated) return;
    
    // Ensure articles is an array before processing
    const validArticles = ensureArticlesArray(articles);
    
    try {
      const article = validArticles.find(a => a.id === articleId);
      if (article?.isLiked) {
        await articlesService.unlikeArticle(articleId);
      } else {
        await articlesService.likeArticle(articleId);
      }
      // Reload articles to get updated like counts
      loadArticles();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to HBP Publishing
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing stories and share your own with our community
        </p>
        {!isAuthenticated && (
          <div className="space-x-4">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Articles Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
        <ArticlesGrid 
          articles={articles} 
          isAuthenticated={isAuthenticated} 
          handleLike={handleLike} 
        />
      </div>
    </div>
  );
};

export default Home;
