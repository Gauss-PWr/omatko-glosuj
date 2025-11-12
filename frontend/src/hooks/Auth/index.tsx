import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLoginMutation,
  useLogoutMutation,
  useLazyStatusQuery,
} from "@/services/auth";
import { setAuth } from "@/store/auth";
import { User } from "@/types";
import type { RootState } from "@/store";
import { useState } from "react";

const STORAGE_KEY = "omatko-licznik-user";

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [triggerStatus] = useLazyStatusQuery();
  const loggedIn = useSelector((s: RootState) => s.auth.authenticated);
  const isAdmin = useSelector((s: RootState) => s.auth.is_admin);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loggedIn) {
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (!storedUser) {
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const data = await triggerStatus().unwrap();
        dispatch(setAuth(data));
      } catch {
        dispatch(setAuth({ authenticated: false }));
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, loggedIn, triggerStatus]);

  const login = async (user: User) => {
    const data = await loginMutation(user).unwrap();
    dispatch(setAuth(data));
    if (data.authenticated) {
      localStorage.setItem(STORAGE_KEY, user.username);
    }
  };

  const logout = async () => {
    const data = await logoutMutation().unwrap();
    dispatch(setAuth(data));
    if (!data.authenticated) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const status = async () => {
    const data = await triggerStatus().unwrap();
    dispatch(setAuth(data));
  };
  return { loggedIn, isAdmin, loading, login, logout, status };
};
export default useAuth;
