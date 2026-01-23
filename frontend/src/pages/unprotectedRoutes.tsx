import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Loading } from '../components/loading';
import { UserContext } from "../App";
import { BACKEND_URL } from "../utils/helpers";

const UnprotectedRoutes = () => {
  const [ loading, setLoading ] = useState(true);
  const [ valid, setValid ] = useState(false);
  const {userContext, changeUser} = useContext(UserContext);

  useEffect(() => {
    const getId = async () => {
      const response = await fetch(`${BACKEND_URL}/api/getUser`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        setLoading(false);
        setValid(false);

        return;
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

  console.log('login');
  return <Outlet />;
}

export default UnprotectedRoutes;