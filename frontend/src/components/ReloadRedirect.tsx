import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ReloadRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if this is a page reload by looking at navigation type
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isReload = navigationEntry?.type === 'reload';
    
    // If it's a reload and we're not on the main page or login page, redirect to main page
    if (isReload && location.pathname !== '/' && location.pathname !== '/login') {
      navigate('/', { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
};

export default ReloadRedirect;
