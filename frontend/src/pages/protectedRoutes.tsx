import { Outlet, Navigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Loading } from '../components/loading';
import { UserContext } from "../App";
import { BACKEND_URL } from "../utils/helpers";

const ProtectedRoutes = () => {
  const [ loading, setLoading ] = useState(true);
  const [ valid, setValid ] = useState(false);
  const { userContext, changeUser } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const getId = async () => {
      const response = await fetch(`${BACKEND_URL}/api/getUser`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        setValid(false);
        setLoading(false);

        return;
      }
      const user = await response.json();

      changeUser(user);
      setLoading(false);
      setValid(true);
    }
    getId();

  }, [changeUser])

  if (loading) return <Loading />;
  if (!valid) return <Navigate to='/auth/login' />;
  if (id !== userContext?.id ) return <Navigate to={`/${userContext?.id}/home`} />;

  return <Outlet />;
}

export default ProtectedRoutes;