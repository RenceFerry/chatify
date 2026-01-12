import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Loading } from '../components/loading';
import { IdContext } from "../App";

const ProtectedRoutes = () => {
  const [ loading, setLoading ] = useState(true);
  const [ valid, setValid ] = useState(false);
  const {idContext} = useContext(IdContext);

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
  if (valid) return <Navigate to={`/${idContext}/home`} />;

  return <Outlet />;
}

export default ProtectedRoutes;