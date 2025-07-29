import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, User, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Article, Comment } from '../types';
import { articlesService } from '../services/articlesService';
import { commentsService } from '../services/commentsService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showMockDataNotice, setShowMockDataNotice] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadArticle();
      loadComments();
    } else {
      setError('Article ID is missing');
      setLoading(false);
    }
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowMockDataNotice(false);
      const data = await articlesService.getArticleById(id!);
      if (data && data.id) {
        setArticle(data);
        // Check if this looks like mock data (basic heuristic)
        if (data.author.id === 'mock-author' || data.title === 'Sample Article') {
          setShowMockDataNotice(true);
        }
      } else {
        setError('Article data is invalid');
      }
    } catch (err: any) {
      console.error('Error loading article:', err);
      
      // Provide specific error messages based on the error type
      if (err.code === 'ENOTFOUND') {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (err.code === 'ETIMEDOUT') {
        setError('Request timed out. The server may be experiencing issues.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You may need to log in to view this article.');
      } else if (err.response?.status === 404) {
        setError('Article not found. It may have been deleted or moved.');
      } else {
        setError('Failed to load article. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentsService.getCommentsByArticleId(id!);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading comments:', err);
      // Set empty array on error instead of undefined
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !article) return;
    
    try {
      if (article.isLiked) {
        await articlesService.unlikeArticle(article.id);
      } else {
        await articlesService.likeArticle(article.id);
      }
      loadArticle(); // Reload to get updated like count
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || !id) return;

    try {
      setCommentLoading(true);
      await commentsService.addComment(id, newComment);
      setNewComment('');
      loadComments(); // Reload comments
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!article || !confirm('Are you sure you want to delete this article?')) return;

    try {
      await articlesService.deleteArticle(article.id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Article</h3>
              <p className="text-red-600">{error || 'Article not found'}</p>
            </div>
            <button
              onClick={() => {
                setError(null);
                loadArticle();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
          <div className="mt-4">
            <Link
              to="/"
              className="text-red-700 hover:text-red-800 underline"
            >
              ← Back to articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safe check for canEdit with proper null checking
  const canEdit = user && article && article.author && (user.id === article.author.id || user.role === 'admin');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mock Data Notice */}
      {showMockDataNotice && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> The API server is currently unavailable. You're viewing sample content. 
                Try refreshing the page to reconnect to the live data.
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowMockDataNotice(false)}
                className="text-yellow-700 hover:text-yellow-800"
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

      <article className="card p-8 mb-8">
        {/* Article Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>
                {article.author?.firstName || 'Unknown'} {article.author?.lastName || 'Author'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(article.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex items-center space-x-2">
              <Link
                to={`/edit/${article.id}`}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDeleteArticle}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Article Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {article.title}
        </h1>

        {/* Article Content */}
        <div className="prose max-w-none mb-8">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </p>
        </div>

        {/* Article Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  article.isLiked 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className={`h-5 w-5 ${article.isLiked ? 'fill-current' : ''}`} />
                <span>{article.likes} {article.likes === 1 ? 'Like' : 'Likes'}</span>
              </button>
            )}
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments</h2>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Share your thoughts..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={commentLoading || !newComment.trim()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Sign in
              </Link>{' '}
              to join the conversation.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {comment.author?.firstName || 'Unknown'} {comment.author?.lastName || 'User'}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy') : 'Unknown date'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {comment.content || 'No content available'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
