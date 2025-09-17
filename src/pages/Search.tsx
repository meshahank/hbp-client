import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, User, FileText, Calendar, Heart } from 'lucide-react';
import { Article } from '../types';
import { articlesService } from '../services/articlesService';

interface SearchResults {
  articles: Article[];
  users: any[];
  total: number;
}

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'all');
  const [results, setResults] = useState<SearchResults>({ articles: [], users: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    
    if (query) {
      setSearchQuery(query);
      setSearchType(type);
      performSearch(query, type);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      console.log('📡 Generating categories from articles...');
      // Since external API doesn't have /categories endpoint, generate from articles
      const allArticlesData = await articlesService.getAllArticles();
      const allArticles = Array.isArray(allArticlesData) ? allArticlesData : (allArticlesData.articles || []);
      
      const categoryMap = new Map();
      
      allArticles.forEach((article: Article) => {
        if (article.category) {
          categoryMap.set(article.category, (categoryMap.get(article.category) || 0) + 1);
        }
      });
      
      const categoriesFromArticles = Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count
      }));
      
      console.log('✅ Categories generated from articles:', categoriesFromArticles);
      setCategories(categoriesFromArticles);
    } catch (error) {
      console.error('❌ Error generating categories:', error);
      setCategories([]);
    }
  };

  const performSearch = async (query: string, type: string = 'all') => {
    if (!query.trim()) return;
    
    console.log('🔍 Performing client-side search:', { query, type });
    setLoading(true);
    
    try {
      // Since the external API doesn't have search endpoint, we'll do client-side search
      console.log('📡 Fetching all articles for client-side search...');
      const allArticlesData = await articlesService.getAllArticles();
      const allArticles = Array.isArray(allArticlesData) ? allArticlesData : (allArticlesData.articles || []);
      
      console.log('✅ All articles fetched:', allArticles.length, 'articles');
      
      // Filter articles locally with improved matching
      const searchTerm = query.toLowerCase().trim();
      const searchWords = searchTerm.split(/\s+/); // Split into words for better matching
      
      const filteredArticles = allArticles.filter((article: Article) => {
        // Check if article matches any search word
        const matchesAnyWord = searchWords.some(word => {
          const titleMatch = article.title?.toLowerCase().includes(word);
          const contentMatch = article.content?.toLowerCase().includes(word);
          const excerptMatch = article.excerpt?.toLowerCase().includes(word);
          const categoryMatch = article.category?.toLowerCase().includes(word);
          const tagMatch = article.tags && article.tags.some(tag => tag.toLowerCase().includes(word));
          const authorFirstNameMatch = article.author?.firstName?.toLowerCase().includes(word);
          const authorLastNameMatch = article.author?.lastName?.toLowerCase().includes(word);
          const authorUsernameMatch = article.author?.username?.toLowerCase().includes(word);
          
          return titleMatch || contentMatch || excerptMatch || categoryMatch || 
                 tagMatch || authorFirstNameMatch || authorLastNameMatch || authorUsernameMatch;
        });
        
        // Also check for exact phrase match
        const exactPhraseMatch = 
          article.title?.toLowerCase().includes(searchTerm) ||
          article.content?.toLowerCase().includes(searchTerm) ||
          (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm));
        
        return matchesAnyWord || exactPhraseMatch;
      });
      
      console.log('✅ Client-side search completed:', filteredArticles.length, 'articles found');
      
      // For user search, we could fetch users too, but for now we'll focus on articles
      setResults({
        articles: type === 'all' || type === 'articles' ? filteredArticles : [],
        users: [], // Could implement user search later
        total: filteredArticles.length
      });
      
    } catch (error: any) {
      console.error('❌ Search failed:', error);
      setResults({ articles: [], users: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchParams({ q: searchQuery, type: searchType });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
          
        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, authors, topics..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>            {/* Search Type Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'articles', label: 'Articles' },
                  { value: 'users', label: 'Authors' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSearchType(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      searchType === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-3">
            {searchQuery && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600">
                  {results.total} {results.total === 1 ? 'result' : 'results'} found
                </p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Articles Results */}
                {(searchType === 'all' || searchType === 'articles') && results.articles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Articles ({results.articles.length})
                    </h3>
                    <div className="space-y-4">
                      {results.articles.map((article) => (
                        <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                          <Link to={`/articles/${article.id}`} className="block">
                            <h4 className="text-xl font-semibold text-gray-900 hover:text-primary-600 mb-2">
                              {article.title}
                            </h4>
                            {article.excerpt && (
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {article.excerpt}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {article.author.firstName} {article.author.lastName}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(article.createdAt)}
                                </span>
                                <span className="flex items-center">
                                  <Heart className="h-4 w-4 mr-1" />
                                  {article.likes}
                                </span>
                              </div>
                              {article.category && (
                                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
                                  {article.category}
                                </span>
                              )}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users Results */}
                {(searchType === 'all' || searchType === 'users') && results.users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Authors ({results.users.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.users.map((user) => (
                        <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {user.firstName} {user.lastName}
                              </h4>
                              <p className="text-gray-600">@{user.username}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchQuery && !loading && results.total === 0 && (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => {
                        setSearchQuery(category.name);
                        setSearchParams({ q: category.name, type: 'articles' });
                      }}
                      className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Tips */}
            <div className="bg-primary-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Search Tips</h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li>• Use specific keywords for better results</li>
                <li>• Search by author name to find their articles</li>
                <li>• Browse categories to discover new content</li>
                <li>• Try different search filters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
