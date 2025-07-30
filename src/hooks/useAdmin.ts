import { useAuth } from '../contexts/AuthContext';

export const useAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  
  const isAdmin = isAuthenticated && user?.role === 'admin';
  
  const canEditAnyArticle = isAdmin;
  const canDeleteAnyArticle = isAdmin;
  const canAccessAdminDashboard = isAdmin;
  
  return {
    isAdmin,
    canEditAnyArticle,
    canDeleteAnyArticle,
    canAccessAdminDashboard,
  };
};
