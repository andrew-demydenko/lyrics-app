"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { TUser } from "@/types/user";
import { axiosWrapper } from "@/lib/axios";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useGlobalContext } from "./global-provider";

interface AuthContextType {
  user: TUser | null;
  setUser: (user: TUser) => void;
  isAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setLoading } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<TUser | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await axiosWrapper.get("auth/current-user");
      const result = await axiosWrapper.get(`users/${data.data.id}`);

      if (result.data) {
        setIsAuth(true);
        setUser(result.data);
      }
    } catch (error) {
      setIsAuth(false);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      router.push(pathname);
    }
  }, [searchParams]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
