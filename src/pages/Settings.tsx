import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Moon, 
  Sun,
  Monitor,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Download,
  Trash2,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'es' | 'fr' | 'de';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  articleLikes: boolean;
  newFollowers: boolean;
  weeklyDigest: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showReadingHistory: boolean;
  showLikedArticles: boolean;
  allowSearch: boolean;
}

interface AppearanceSettings {
  theme: Theme;
  language: Language;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    articleLikes: true,
    newFollowers: true,
    weeklyDigest: true,
    marketing: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showReadingHistory: true,
    showLikedArticles: true,
    allowSearch: true
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    compactMode: false
  });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      }));
    }
  }, [user]);

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: Settings }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Settings</h2>
          <p className="text-gray-600 mb-6">
            Sign in to manage your account settings and preferences.
          </p>
          <div className="space-y-3">
            <a href="/login" className="btn btn-primary w-full">Sign In</a>
            <a href="/register" className="btn btn-secondary w-full">Create Account</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="input w-full"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="input w-full"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Communication</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">Email Notifications</div>
                              <div className="text-sm text-gray-500">Receive notifications via email</div>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.emailNotifications}
                              onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">Push Notifications</div>
                              <div className="text-sm text-gray-500">Receive push notifications on your device</div>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.pushNotifications}
                              onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Activity</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'articleLikes', label: 'Article Likes', desc: 'When someone likes your articles' },
                          { key: 'newFollowers', label: 'New Followers', desc: 'When someone follows you' },
                          { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your activity' },
                          { key: 'marketing', label: 'Marketing', desc: 'Updates about new features and promotions' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-500">{item.desc}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications[item.key as keyof NotificationSettings] as boolean}
                                onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={privacy.profileVisibility === 'public'}
                              onChange={() => setPrivacy(prev => ({ ...prev, profileVisibility: 'public' }))}
                              className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-3">
                              <span className="font-medium text-gray-900">Public</span>
                              <span className="block text-sm text-gray-500">Anyone can see your profile and articles</span>
                            </span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={privacy.profileVisibility === 'private'}
                              onChange={() => setPrivacy(prev => ({ ...prev, profileVisibility: 'private' }))}
                              className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-3">
                              <span className="font-medium text-gray-900">Private</span>
                              <span className="block text-sm text-gray-500">Only you can see your profile</span>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Visibility</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'showReadingHistory', label: 'Show Reading History', desc: 'Let others see articles you\'ve read' },
                          { key: 'showLikedArticles', label: 'Show Liked Articles', desc: 'Let others see articles you\'ve liked' },
                          { key: 'allowSearch', label: 'Allow Search', desc: 'Let others find you in search results' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-500">{item.desc}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={privacy[item.key as keyof PrivacySettings] as boolean}
                                onChange={(e) => setPrivacy(prev => ({ ...prev, [item.key]: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor }
                        ].map((theme) => {
                          const IconComponent = theme.icon;
                          return (
                            <button
                              key={theme.value}
                              onClick={() => setAppearance(prev => ({ ...prev, theme: theme.value as Theme }))}
                              className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all duration-200 ${
                                appearance.theme === theme.value
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <IconComponent className="h-6 w-6" />
                              <span className="font-medium">{theme.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
                      <select
                        value={appearance.language}
                        onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value as Language }))}
                        className="input w-full max-w-xs"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Reading</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                          <select
                            value={appearance.fontSize}
                            onChange={(e) => setAppearance(prev => ({ ...prev, fontSize: e.target.value as 'small' | 'medium' | 'large' }))}
                            className="input w-full max-w-xs"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Compact Mode</div>
                            <div className="text-sm text-gray-500">Show more content per page</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={appearance.compactMode}
                              onChange={(e) => setAppearance(prev => ({ ...prev, compactMode: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.currentPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="input w-full pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="input w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="input w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Privacy</h3>
                      <div className="space-y-4">
                        <button className="flex items-center w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <Download className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">Download Your Data</div>
                            <div className="text-sm text-gray-500">Get a copy of all your data</div>
                          </div>
                        </button>
                        
                        <button className="flex items-center w-full p-4 text-left bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 text-red-700">
                          <Trash2 className="h-5 w-5 text-red-500 mr-3" />
                          <div>
                            <div className="font-medium">Delete Account</div>
                            <div className="text-sm text-red-600">Permanently delete your account and all data</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Session</h3>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <LogOut className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">Sign Out</div>
                          <div className="text-sm text-gray-500">Sign out of your account</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Changes are automatically saved
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="btn btn-primary flex items-center"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
