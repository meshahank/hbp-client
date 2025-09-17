import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  User, 
  Edit, 
  Trash2, 
  BookOpen
} from 'lucide-react';
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
// Hero Section Component
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
            Blog
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Discover our latest news
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover the achievements that set us apart. From groundbreaking projects to industry accolades, 
          we take pride in our accomplishments.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex">
          <input
            type="text"
            name="search"
            placeholder="Search articles..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors">
            Find Now
          </button>
        </form>
      </div>
    </section>
  );
};

// Article Card Component
interface ArticleCardProps {
  article: Article;
  onLike: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, title: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  showActions?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onLike, 
  onEdit, 
  onDelete, 
  isAuthenticated, 
  isAdmin, 
  showActions = false 
}) => {
  const navigate = useNavigate();
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on a button inside the card
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    navigate(`/article/${article.id}`);
  };
  return (
    <article
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/article/${article.id}`); }}
      aria-label={`Open article: ${article.title}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium mb-2">
              {article.category || (article.status === 'published' ? 'Article' : 'Draft')}
            </span>
            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
              {article.title}
            </h3>
          </div>
          {showActions && (isAdmin || article.author.id === 'current-user') && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <button
                onClick={e => { e.stopPropagation(); onEdit && onEdit(article.id); }}
                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onDelete && onDelete(article.id, article.title); }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt || `${article.content.slice(0, 150)}...`}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{article.author.firstName} {article.author.lastName}</span>
            <span>•</span>
            <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
          </div>
          
          <button
            onClick={e => { e.stopPropagation(); isAuthenticated && onLike(article.id); }}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
              article.isLiked
                ? 'text-red-600 bg-red-50'
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            }`}
            disabled={!isAuthenticated}
          >
            <Heart className={`h-4 w-4 ${article.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{article.likes}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

// Main Home Component
const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sidebarArticles, setSidebarArticles] = useState<{
    featured: Article[];
    latest: Article[];
  }>({ featured: [], latest: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articlesService.getAllArticles();
        // Handle new API structure
        if (data && typeof data === 'object' && 'articles' in data) {
          const validArticles = ensureArticlesArray(data.articles);
          setArticles(validArticles);
          
          // Set sidebar articles
          const allArticles = validArticles;
          setSidebarArticles({
            featured: allArticles.slice(0, 3), // First 3 articles as featured
            latest: allArticles.slice(3, 4)    // 4th article as latest
          });
        } else {
          const validArticles = ensureArticlesArray(data);
          setArticles(validArticles);
          
          // Set sidebar articles for backward compatibility
          setSidebarArticles({
            featured: validArticles.slice(0, 3),
            latest: validArticles.slice(3, 4)
          });
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles');
        setArticles([...mockArticles]);
        // Fallback sidebar with mock data
        setSidebarArticles({
          featured: mockArticles.slice(0, 3),
          latest: mockArticles.slice(3, 4)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleLike = async (articleId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
      // Revert optimistic update
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { 
              ...article, 
              isLiked: !article.isLiked,
              likes: article.isLiked ? article.likes + 1 : article.likes - 1
            }
          : article
      ));
    }
  };

  const handleEditArticle = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await articlesService.deleteArticle(id);
        setArticles(prev => prev.filter(article => article.id !== id));
      } catch (err) {
        console.error('Error deleting article:', err);
        alert('Failed to delete article');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const validArticles = ensureArticlesArray(articles);
  const featuredArticle = validArticles.find(article => article.status === 'published') || validArticles[0];
  const recentArticles = validArticles.filter(article => article.id !== featuredArticle?.id).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Trending articles
              </h2>
              
              {/* Featured Articles Grid */}
              {recentArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentArticles.slice(0, 6).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onLike={handleLike}
                      onEdit={handleEditArticle}
                      onDelete={handleDeleteArticle}
                      isAuthenticated={isAuthenticated}
                      isAdmin={isAdmin}
                      showActions={isAuthenticated && (isAdmin || article.author.id === user?.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles yet</h3>
                  <p className="text-gray-500 mb-6">Be the first to share your story with the community.</p>
                  {isAuthenticated ? (
                    <Link to="/create" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                      Write Your First Article
                    </Link>
                  ) : (
                    <Link to="/register" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                      Join Our Community
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Featured Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured</h3>
                  <div className="space-y-4">
                    {sidebarArticles.featured.map((article) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.id}`}
                        className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-2">
                            {format(new Date(article.createdAt), 'MMMM d, yyyy')}
                          </p>
                          <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {article.excerpt || `${article.content.slice(0, 80)}...`}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            <span>{article.author.firstName} {article.author.lastName}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    {sidebarArticles.featured.length === 0 && !loading && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No featured articles available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Latest Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest</h3>
                  {sidebarArticles.latest.length > 0 ? (
                    <Link
                      to={`/article/${sidebarArticles.latest[0].id}`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-2">
                          {format(new Date(sidebarArticles.latest[0].createdAt), 'MMMM d, yyyy')}
                        </p>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2">
                          {sidebarArticles.latest[0].title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-3">
                          {sidebarArticles.latest[0].excerpt || `${sidebarArticles.latest[0].content.slice(0, 100)}...`}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span>{sidebarArticles.latest[0].author.firstName} {sidebarArticles.latest[0].author.lastName}</span>
                        </div>
                      </div>
                    </Link>
                  ) : !loading && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No latest articles available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Call to Action */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Share Your Voice?
            </h2>
            <p className="text-xl text-primary-200 mb-8 leading-relaxed">
              Join our community of thoughtful writers and engaged readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Writing Today
              </Link>
              <Link to="/explore" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Explore Articles
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
