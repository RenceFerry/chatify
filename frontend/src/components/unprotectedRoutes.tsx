import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading } from './loading';

const ProtectedRoutes = () => {
  const [ loading, setLoading ] = useState(true);
  const [ valid, setValid ] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/authenticate`, {
        method: 'POST',
        credentials: 'include',
      })
      setValid(result.ok);
      setLoading(false);
    }
    authenticate();
  }, []);

  if (loading) return <Loading />;
  if (valid) return <Navigate to='/' />;

  return <Outlet />;
}

export default ProtectedRoutes;