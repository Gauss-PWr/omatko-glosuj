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
        dispatch(setAuth(data.authenticated));
        if (!data.authenticated) {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        dispatch(setAuth(false));
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, triggerStatus]);

  const login = async (user: User) => {
    const data = await loginMutation(user).unwrap();
    dispatch(setAuth(data.authenticated));
    if (data.authenticated) {
      localStorage.setItem(STORAGE_KEY, user.username);
    }
  };

  const logout = async () => {
    const data = await logoutMutation().unwrap();
    dispatch(setAuth(data.authenticated));
    if (!data.authenticated) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const status = async () => {
    const data = await triggerStatus().unwrap();
    return data.authenticated;
  };

  return { loading, loggedIn, login, logout, status };
};

export default useAuth;
