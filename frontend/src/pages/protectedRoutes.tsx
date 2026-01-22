import { Outlet, Navigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Loading } from '../components/loading';
import { UserContext } from "../App";

const ProtectedRoutes = () => {
  const [ loading, setLoading ] = useState(true);
  const [ valid, setValid ] = useState(false);
  const { userContext, changeUser } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const authenticate = async () => {
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/authenticate`, {
        method: 'POST',
        credentials: 'include',
      })
      setValid(result.ok);
      setLoading(false);
    }

    const getId = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getUser`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) return;
      const user = await response.json();

      changeUser(user);
    }
    authenticate();
    getId();

  }, [changeUser])

  if (loading) return <Loading />;
  if (!valid) return <Navigate to='/auth/login' />;
  if (id !== userContext?.id ) return <Navigate to={`/${userContext?.id}/home`} />;

  return <Outlet />;
}

export default ProtectedRoutes;