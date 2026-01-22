import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Loading } from '../components/loading';
import { UserContext } from "../App";
import { BACKEND_URL } from "../utils/helpers";

const ProtectedRoutes = () => {
  const [ loading, setLoading ] = useState(true);
  const [ valid, setValid ] = useState(false);
  const {userContext, changeUser} = useContext(UserContext);

  useEffect(() => {
    const authenticate = async () => {
      const result = await fetch(`${BACKEND_URL}/api/auth/authenticate`, {
        method: 'POST',
        credentials: 'include',
      })

      return result.ok;
    }

    const getId = async () => {
      const isAuthenticate = await authenticate();

      const response = await fetch(`${BACKEND_URL}/api/getUser`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok || !isAuthenticate) {
        setLoading(false);
        setValid(false);
      }
      const user = await response.json();

      changeUser(user);
      setLoading(false);
      setValid(true);
    }
    getId();
  }, [changeUser]);

  if (loading) return <Loading />;
  if (valid) return <Navigate to={`/${userContext!.id}/home`} />;

  return <Outlet />;
}

export default ProtectedRoutes;