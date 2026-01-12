import { Outlet, Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Loading } from '../components/loading';

const ProtectedRoutes = () => {
  const [ loading, setLoading ] = useState(true);
  const [ valid, setValid ] = useState(false);
  const { id } = useParams();
  console.log('hekko')
  if (!id) return <Navigate to='/notFound' />;

  const authenticate = async () => {
    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/authenticate`, {
      method: 'POST',
      credentials: 'include',
    })
    setValid(result.ok);
    setLoading(false);
  }
  authenticate();

  if (loading) return <Loading />;
  if (!valid) return <Navigate to='/auth/login' />;

  return <Outlet />;
}

export default ProtectedRoutes;