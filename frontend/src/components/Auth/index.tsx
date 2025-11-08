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

const STORAGE_KEY = "omatko-licznik-user";

export const useAuth = () => {
  const dispatch = useDispatch();
  const loggedIn = useSelector((s: RootState) => s.auth.authenticated);
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [triggerStatus] = useLazyStatusQuery();

  useEffect(() => {
    if (loggedIn) {
      return;
    }

    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (!storedUser) {
      return;
    }

    void triggerStatus()
      .unwrap()
      .then((data) => {
        if (data.authenticated) {
          dispatch(setAuth(true));
        } else {
          localStorage.removeItem(STORAGE_KEY);
          dispatch(setAuth(false));
        }
      })
      .catch((error) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "status" in error &&
          (error as { status?: number }).status === 401
        ) {
          localStorage.removeItem(STORAGE_KEY);
        }
        dispatch(setAuth(false));
      });
  }, [dispatch, triggerStatus, loggedIn]);

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

  return { loggedIn, login, logout, status };
};

export default useAuth;
