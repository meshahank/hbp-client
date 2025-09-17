import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Heart, 
  Bookmark, 
  Clock, 
  Grid3X3, 
  List,
  Search,
  Archive,
  Calendar,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Article } from '../types';
import { articlesService } from '../services/articlesService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { mockArticles } from '../data/mockData';

interface SavedArticle extends Article {
  savedAt: string;
  isBookmarked: boolean;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'bookmarked' | 'liked' | 'reading' | 'completed';

const LibraryPage: React.FC = () => {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<SavedArticle[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchSavedArticles = async () => {
      try {
        setLoading(true);
        const articles = await articlesService.getAllArticles();
        const validArticles = Array.isArray(articles) ? articles : [...mockArticles];
        
        // Mock saved articles with additional metadata
        const saved: SavedArticle[] = validArticles
          .filter(article => article.status === 'published')
          .slice(0, 8)
          .map((article, index) => ({
            ...article,
            savedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            isBookmarked: index % 3 === 0
          }));
        
        setSavedArticles(saved);
        setFilteredArticles(saved);
      } catch (err) {
        console.error('Error fetching saved articles:', err);
        const mockSaved: SavedArticle[] = mockArticles.slice(0, 8).map((article, index) => ({
          ...article,
          savedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          isBookmarked: index % 3 === 0
        }));
        setSavedArticles(mockSaved);
        setFilteredArticles(mockSaved);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = [...savedArticles];

    // Apply filter
    switch (activeFilter) {
      case 'bookmarked':
        filtered = filtered.filter(article => article.isBookmarked);
        break;
      case 'liked':
        filtered = filtered.filter(article => article.likes > 10);
        break;
      case 'reading':
        // Mock: articles saved within last 7 days
        filtered = filtered.filter(article => 
          new Date(article.savedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        );
        break;
      case 'completed':
        // Mock: older articles
        filtered = filtered.filter(article => 
          new Date(article.savedAt).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000
        );
        break;
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${article.author.firstName} ${article.author.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  }, [savedArticles, activeFilter, searchQuery]);

  const filterOptions = [
    { key: 'all', label: 'All Articles', count: savedArticles.length, icon: BookOpen },
    { key: 'bookmarked', label: 'Bookmarked', count: savedArticles.filter(a => a.isBookmarked).length, icon: Bookmark },
    { key: 'liked', label: 'Liked', count: savedArticles.filter(a => a.likes > 10).length, icon: Heart },
    { key: 'reading', label: 'Currently Reading', count: savedArticles.filter(a => new Date(a.savedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length, icon: Clock },
    { key: 'completed', label: 'Completed', count: savedArticles.filter(a => new Date(a.savedAt).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000).length, icon: Archive }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Your Library</h2>
          <p className="text-gray-600 mb-6">
            Sign in to view your saved articles, bookmarks, and reading progress.
          </p>
          <div className="space-y-3">
            <Link to="/login" className="btn btn-primary w-full">Sign In</Link>
            <Link to="/register" className="btn btn-secondary w-full">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
                  <p className="text-gray-600 mt-1">
                    Your personal collection of saved articles and stories
                  </p>
                </div>
              </div>
            </div>
            <Link to="/explore" className="btn btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Discover More
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Library Filters</h3>
              <div className="space-y-2">
                {filterOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.key}
                      onClick={() => setActiveFilter(option.key as FilterType)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors duration-200 ${
                        activeFilter === option.key
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <IconComponent className="h-5 w-5 mr-3" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        activeFilter === option.key ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        {option.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reading Stats */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Reading Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Articles Read</span>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hours Spent</span>
                  <span className="font-semibold text-gray-900">18h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Favorite Topic</span>
                  <span className="badge badge-secondary">Technology</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reading Streak</span>
                  <span className="font-semibold text-green-600">7 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Articles */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Try adjusting your search or filters.' : 'Start building your library by saving articles you love.'}
                </p>
                <Link to="/explore" className="btn btn-primary">
                  Explore Articles
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className={`card p-6 hover:shadow-lg transition-all duration-300 ${
                      viewMode === 'list' ? 'flex items-start space-x-4' : ''
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              Saved {format(new Date(article.savedAt), 'MMM d')}
                            </span>
                            {article.isBookmarked && (
                              <Bookmark className="h-4 w-4 text-primary-600 fill-current" />
                            )}
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <Link to={`/article/${article.id}`}>
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
                            {article.title}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.content.slice(0, 150)}...
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>{article.author.firstName} {article.author.lastName}</span>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {article.likes}
                            </div>
                          </div>
                          <span>5 min read</span>
                        </div>
                      </>
                    ) : (
                      // List View
                      <>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Link to={`/article/${article.id}`}>
                              <h3 className="font-bold text-gray-900 hover:text-primary-600 transition-colors duration-200">
                                {article.title}
                              </h3>
                            </Link>
                            {article.isBookmarked && (
                              <Bookmark className="h-4 w-4 text-primary-600 fill-current" />
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {article.content.slice(0, 200)}...
                          </p>
                          
                          <div className="flex items-center space-x-6 text-xs text-gray-500">
                            <span>{article.author.firstName} {article.author.lastName}</span>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Saved {format(new Date(article.savedAt), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {article.likes}
                            </div>
                            <span>5 min read</span>
                          </div>
                        </div>
                        
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
