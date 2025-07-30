import { Article, User } from '../types';

const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user'
};

const mockUser2: User = {
  id: '2',
  email: 'jane@example.com',
  username: 'janesmith',
  firstName: 'Jane',
  lastName: 'Smith',
  role: 'user'
};

const mockUser3: User = {
  id: '3',
  email: 'mike@example.com',
  username: 'mikebrown',
  firstName: 'Mike',
  lastName: 'Brown',
  role: 'user'
};

const mockAdmin: User = {
  id: '4',
  email: 'admin@example.com',
  username: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Welcome to HBP Publishing',
    content: 'This is a sample article to demonstrate the publishing platform. You can create, edit, and share your stories with the community. The platform supports rich text content, comments, and likes.',
    status: 'published',
    author: mockUser,
    likes: 5,
    isLiked: false,
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Getting Started with Publishing',
    content: 'Publishing your first article is easy! Simply click the "Write" button in the navigation, create your content, and choose whether to save as draft or publish immediately. Your readers will be able to like and comment on your published articles.',
    status: 'published',
    author: mockUser,
    likes: 3,
    isLiked: false,
    createdAt: '2025-01-19T15:30:00Z',
    updatedAt: '2025-01-19T15:30:00Z'
  },
  {
    id: '3',
    title: 'Building Community Through Stories',
    content: 'The power of storytelling lies in its ability to connect people. Share your experiences, insights, and creativity with our growing community of writers and readers.',
    status: 'published',
    author: mockUser,
    likes: 8,
    isLiked: false,
    createdAt: '2025-01-18T09:15:00Z',
    updatedAt: '2025-01-18T09:15:00Z'
  },
  {
    id: '4',
    title: 'Platform Updates and Guidelines',
    content: 'Welcome to our publishing platform! As an admin, I want to ensure everyone has the best experience. Please follow our community guidelines: be respectful, create original content, and engage positively with other authors.',
    status: 'published',
    author: mockAdmin,
    likes: 12,
    isLiked: false,
    createdAt: '2025-01-17T14:00:00Z',
    updatedAt: '2025-01-17T14:00:00Z'
  }
];

export const mockComments = [
  {
    id: '1',
    content: 'Great article! Looking forward to more content.',
    author: mockUser,
    articleId: '1',
    createdAt: '2025-01-20T12:00:00Z',
    updatedAt: '2025-01-20T12:00:00Z'
  },
  {
    id: '2',
    content: 'This is really helpful for new writers. Thanks for sharing!',
    author: mockUser2,
    articleId: '2',
    createdAt: '2025-01-19T16:00:00Z',
    updatedAt: '2025-01-19T16:00:00Z'
  },
  {
    id: '3',
    content: 'Love the community aspect of this platform!',
    author: mockUser3,
    articleId: '3',
    createdAt: '2025-01-18T10:30:00Z',
    updatedAt: '2025-01-18T10:30:00Z'
  },
  {
    id: '4',
    content: 'Excellent insights! I\'ve learned a lot from this.',
    author: mockUser,
    articleId: '1',
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z'
  }
];

export default mockUser2; mockUser3;