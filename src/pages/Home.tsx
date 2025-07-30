import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { Article } from '../types';
import { articlesService } from '../services/articlesService';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
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
  isAdmin: boolean;
  onEditArticle: (id: string) => void;
  onDeleteArticle: (id: string, title: string) => void;
}

const ArticlesGrid: React.FC<ArticlesGridProps> = ({ 
  articles, 
  isAuthenticated, 
  handleLike, 
  isAdmin, 
  onEditArticle, 
  onDeleteArticle 
}) => {
  const validArticles = ensureArticlesArray(articles);
  
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
        <article key={article.id} className="card p-6 hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <Link 
              to={`/article/${article.id}`}
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {article.title}
            </Link>
          </div>
          
          <div className="text-gray-600 mb-4 line-clamp-3">
            {article.content.length > 150 
              ? `${article.content.substring(0, 150)}...` 
              : article.content
            }
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
            <Link 
              to={`/article/${article.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Read more
            </Link>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <button
                  onClick={() => handleLike(article.id)}
                  className={`flex items-center space-x-1 ${
                    article.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                  } transition-colors`}
                >
                  <Heart className={`h-4 w-4 ${article.isLiked ? 'fill-current' : ''}`} />
                  <span>{article.likes}</span>
                </button>
              )}
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span>0</span>
              </div>
              
              {isAdmin && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEditArticle(article.id)}
                    className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Edit article"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteArticle(article.id, article.title)}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
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
  const [showMockDataNotice, setShowMockDataNotice] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowMockDataNotice(false);
      const data = await articlesService.getAllArticles();
      
      // Ensure data is an array using our type guard
      const validArticles = ensureArticlesArray(data);
      setArticles(validArticles);
      
      // Check if we're likely using mock data
      if (validArticles.length > 0 && validArticles.every(article => 
        mockArticles.some(mock => mock.id === article.id)
      )) {
        setShowMockDataNotice(true);
      }
      
      if (!Array.isArray(data)) {
        setError('Unexpected data format from API. Showing sample content.');
        setShowMockDataNotice(true);
      }
    } catch (err: any) {
      console.error('Error loading articles:', err);
      
      // Always use mock data as fallback to ensure articles is an array
      setArticles(ensureArticlesArray(mockArticles));
      setShowMockDataNotice(true);
      
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

  const handleEditArticle = (articleId: string) => {
    navigate(`/edit/${articleId}`);
  };

  const handleDeleteArticle = async (articleId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await articlesService.deleteArticleAsAdmin(articleId);
      setArticles(articles.filter(article => article.id !== articleId));
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mock Data Notice */}
      {showMockDataNotice && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> You're viewing sample articles. The API server may be temporarily unavailable.
                <button 
                  onClick={() => {
                    setShowMockDataNotice(false);
                    loadArticles();
                  }}
                  className="ml-2 underline hover:text-blue-800"
                >
                  Try to reconnect
                </button>
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowMockDataNotice(false)}
                className="text-blue-700 hover:text-blue-800"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

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
          isAdmin={isAdmin}
          onEditArticle={handleEditArticle}
          onDeleteArticle={handleDeleteArticle}
        />
      </div>
    </div>
  );
};

export default Home;
