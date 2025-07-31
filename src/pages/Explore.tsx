import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  BookOpen, 
  User, 
  Calendar, 
  TrendingUp,
  Clock,
  ChevronDown
} from 'lucide-react';
import { Article } from '../types';
import { articlesService } from '../services/articlesService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { mockArticles } from '../data/mockData';

const ExplorePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'published' | 'draft'>('all');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articlesService.getAllArticles();
        const validArticles = Array.isArray(data) ? data : [...mockArticles];
        setArticles(validArticles);
        setFilteredArticles(validArticles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setArticles([...mockArticles]);
        setFilteredArticles([...mockArticles]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = [...articles];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${article.author.firstName} ${article.author.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.status === categoryFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'trending':
        // For now, trending is based on likes but could be more sophisticated
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, sortBy, categoryFilter]);

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

  const ArticleGridView: React.FC<{ articles: Article[] }> = ({ articles }) => (
    <div className="grid-responsive">
      {articles.map((article) => (
        <article key={article.id} className="card p-6 group hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className={`badge ${article.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
              {article.status}
            </span>
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
              className="hover:text-indigo-600 transition-colors duration-200"
            >
              {article.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {article.content.slice(0, 150)}...
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
  );

  const ArticleListView: React.FC<{ articles: Article[] }> = ({ articles }) => (
    <div className="space-y-6">
      {articles.map((article) => (
        <article key={article.id} className="card p-6 flex gap-6 hover:shadow-lg transition-all duration-300">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className={`badge ${article.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                {article.status}
              </span>
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
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              <Link 
                to={`/article/${article.id}`} 
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                {article.title}
              </Link>
            </h3>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              {article.content.slice(0, 200)}...
            </p>
            
            <div className="flex items-center justify-between">
              <Link 
                to={`/article/${article.id}`}
                className="btn btn-ghost"
              >
                Read More
              </Link>
              
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
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Stories</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing stories from our community of talented writers
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>
            
            {/* Filters and View Options */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Stories</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <BookOpen className="h-5 w-5" />
            <span>
              {filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'} found
            </span>
          </div>
          
          {searchTerm && (
            <div className="text-sm text-gray-500">
              Results for "<span className="font-medium text-gray-900">{searchTerm}</span>"
            </div>
          )}
        </div>

        {/* Articles */}
        {filteredArticles.length > 0 ? (
          viewMode === 'grid' ? (
            <ArticleGridView articles={filteredArticles} />
          ) : (
            <ArticleListView articles={filteredArticles} />
          )
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setSortBy('latest');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
