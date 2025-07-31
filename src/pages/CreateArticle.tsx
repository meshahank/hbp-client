import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  Eye, 
  FileText, 
  Type, 
  PenTool,
  ArrowLeft,
  AlertCircle,
  Check
} from 'lucide-react';
import { articlesService } from '../services/articlesService';
import { ArticleFormData } from '../types';

interface FormData {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  status: 'draft' | 'published';
}

const CreateArticle: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isDirty },
    setValue 
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      status: 'draft'
    }
  });

  const watchedContent = watch();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSaveStatus('saving');

    try {
      const articleData: ArticleFormData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : undefined,
        status: data.status
      };

      const result = await articlesService.createArticle(articleData);
      setSaveStatus('saved');
      
      setTimeout(() => {
        navigate(`/article/${result.id}`);
      }, 1000);
    } catch (error) {
      console.error('Error creating article:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = () => {
    setValue('status', 'draft');
    handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    setValue('status', 'published');
    handleSubmit(onSubmit)();
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (text: string) => {
    const wordCount = getWordCount(text);
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              
              <div className="h-6 w-px bg-gray-200"></div>
              
              <div className="flex items-center space-x-2">
                <PenTool className="h-5 w-5 text-indigo-600" />
                <h1 className="text-lg font-semibold text-gray-900">Create New Story</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Save Status */}
              {saveStatus !== 'idle' && (
                <div className="flex items-center space-x-2">
                  {saveStatus === 'saving' && (
                    <>
                      <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">Saving...</span>
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Saved!</span>
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Error saving</span>
                    </>
                  )}
                </div>
              )}

              {/* Preview Toggle */}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`btn btn-ghost ${previewMode ? 'bg-indigo-50 text-indigo-600' : ''}`}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </button>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveAsDraft}
                  disabled={isSubmitting || !isDirty}
                  className="btn btn-secondary"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Draft
                </button>
                
                <button
                  onClick={handlePublish}
                  disabled={isSubmitting || !watchedContent.title || !watchedContent.content}
                  className="btn btn-primary"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {previewMode ? (
              /* Preview Mode */
              <div className="card p-8">
                <div className="prose prose-lg max-w-none">
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    {watchedContent.title || 'Untitled Story'}
                  </h1>
                  
                  <div className="text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
                    {watchedContent.content || 'Start writing your story...'}
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title Input */}
                <div className="card p-6">
                  <div className="flex items-center mb-4">
                    <Type className="h-5 w-5 text-indigo-600 mr-2" />
                    <label className="text-lg font-semibold text-gray-900">
                      Story Title
                    </label>
                  </div>
                  
                  <input
                    {...register('title', { 
                      required: 'Title is required',
                      minLength: { value: 3, message: 'Title must be at least 3 characters' }
                    })}
                    type="text"
                    placeholder="Enter your story title..."
                    className="w-full text-2xl font-bold border-0 bg-transparent focus:outline-none focus:ring-0 placeholder-gray-400 resize-none"
                  />
                  
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Content Input */}
                <div className="card p-6">
                  <div className="flex items-center mb-4">
                    <PenTool className="h-5 w-5 text-indigo-600 mr-2" />
                    <label className="text-lg font-semibold text-gray-900">
                      Story Content
                    </label>
                  </div>
                  
                  <textarea
                    {...register('content', { 
                      required: 'Content is required',
                      minLength: { value: 50, message: 'Content must be at least 50 characters' }
                    })}
                    placeholder="Tell your story..."
                    rows={20}
                    className="w-full border-0 bg-transparent focus:outline-none focus:ring-0 placeholder-gray-400 resize-none text-lg leading-relaxed"
                  />
                  
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.content.message}
                    </p>
                  )}
                </div>

                {/* Excerpt Input */}
                <div className="card p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                    <label className="text-lg font-semibold text-gray-900">
                      Article Excerpt
                    </label>
                  </div>
                  
                  <textarea
                    {...register('excerpt')}
                    placeholder="Write a brief summary or excerpt (optional)..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Category and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Input */}
                  <div className="card p-6">
                    <div className="flex items-center mb-4">
                      <Type className="h-5 w-5 text-indigo-600 mr-2" />
                      <label className="text-lg font-semibold text-gray-900">
                        Category
                      </label>
                    </div>
                    
                    <input
                      {...register('category')}
                      type="text"
                      placeholder="e.g., Technology, Lifestyle, Business..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>

                  {/* Tags Input */}
                  <div className="card p-6">
                    <div className="flex items-center mb-4">
                      <Type className="h-5 w-5 text-indigo-600 mr-2" />
                      <label className="text-lg font-semibold text-gray-900">
                        Tags
                      </label>
                    </div>
                    
                    <input
                      {...register('tags')}
                      type="text"
                      placeholder="Separate tags with commas..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter tags separated by commas (e.g., react, javascript, web development)
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Writing Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Characters:</span>
                  <span className="font-medium text-gray-900">
                    {watchedContent.content?.length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Words:</span>
                  <span className="font-medium text-gray-900">
                    {getWordCount(watchedContent.content || '')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reading time:</span>
                  <span className="font-medium text-gray-900">
                    {getReadingTime(watchedContent.content || '')} min
                  </span>
                </div>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing Tips</h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Start with a compelling hook to grab readers' attention</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use descriptive language to paint vivid scenes</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep paragraphs short for better readability</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>End with a satisfying conclusion or cliffhanger</p>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shortcuts</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Save Draft:</span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+S</code>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Preview:</span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+P</code>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Publish:</span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Enter</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
