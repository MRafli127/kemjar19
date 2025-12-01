import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !hasRedirected) {
      setHasRedirected(true);
      if (user) {
        window.location.replace('/dashboard');
      } else {
        window.location.replace('/login');
      }
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner"></div>
    </div>
  );
}
