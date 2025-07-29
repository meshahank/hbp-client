# HBP Publishing Client

A modern React-based publishing platform that allows users to create, read, and interact with articles. Built with React, TypeScript, Tailwind CSS, and React Router.

## Features

- **User Authentication**: Register, login, and profile management
- **Article Management**: Create, read, edit, and delete articles
- **Interactive Features**: Like articles and comment on them
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic content loading and updates
- **Modern UI**: Clean and intuitive user interface

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Package Manager**: npm

## API Integration

The application integrates with the HBP API (https://hbp-api.onrender.com) providing:

- Authentication endpoints (register, login, profile)
- Articles CRUD operations
- Comments system
- User management
- Like/unlike functionality

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hbp-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   └── ProtectedRoute.tsx # Authentication guard
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utility libraries
│   └── api.ts         # Axios configuration
├── pages/             # Route components
│   ├── Home.tsx       # Homepage with articles list
│   ├── Login.tsx      # Login page
│   ├── Register.tsx   # Registration page
│   ├── ArticleDetail.tsx # Single article view
│   ├── CreateArticle.tsx # Article creation
│   ├── EditArticle.tsx   # Article editing
│   ├── Profile.tsx       # User profile
│   └── Dashboard.tsx     # User dashboard
├── services/          # API service functions
│   ├── authService.ts
│   ├── articlesService.ts
│   └── commentsService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app component
├── main.tsx          # App entry point
└── index.css         # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

The application uses the following API base URL:
```
API_BASE_URL=https://hbp-api.onrender.com/api
```

## Features Overview

### Authentication
- User registration with email, username, and personal details
- Secure login with JWT token management
- Automatic token refresh and logout on expiration
- Protected routes for authenticated users only

### Articles
- Browse all published articles on the homepage
- View detailed article content with comments
- Create new articles with draft/published status
- Edit and delete own articles
- Like/unlike articles (authenticated users only)

### Comments
- Add comments to articles
- View all comments with author information
- Real-time comment updates

### User Interface
- Responsive design that works on all devices
- Clean, modern interface with intuitive navigation
- Loading states and error handling
- Toast notifications for user feedback

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
