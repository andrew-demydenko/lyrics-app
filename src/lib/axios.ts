import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "@/constants/paths";
import { AuthService } from "@/services/auth.service";
import { EnumTokens } from "@/constants/auth";

interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

const isServer = typeof window === "undefined";
let _retry = false;
let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = !isServer ? Cookies.get(EnumTokens.ACCESS_TOKEN) : null;

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (isServer) {
      return Promise.reject(error);
    }
    const originalRequest = error.config;
    if ([401, 403].includes(error.response?.status) && !_retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        });
      }

      _retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosWrapper.post("/auth/refresh-token");
        const newAccessToken = data.accessToken;

        if (typeof window !== "undefined") {
          AuthService.setAccessToken(newAccessToken);
        }

        pendingRequests.forEach((r) => {
          r.resolve(newAccessToken);
        });

        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;

        return axiosInstance(originalRequest);
      } catch (err) {
        pendingRequests.forEach((r) => {
          r.reject(err);
        });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        pendingRequests = [];
        _retry = false;
      }
    }

    return Promise.reject(error);
  }
);

const setHeaders = async (config: AxiosRequestConfig = {}) => {
  if (isServer) {
    const { cookies } = await import("next/headers");

    const cookieStore = cookies();
    const accessToken = cookieStore.get(EnumTokens.ACCESS_TOKEN)?.value;
    if (cookieStore) {
      config.headers = {
        ...config.headers,
        cookie: cookieStore.toString(),
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      };
    }
  }
};

export const axiosWrapper = {
  get: async (url: string, config: AxiosRequestConfig = {}) => {
    await setHeaders(config);
    return axiosInstance.get(url, config);
  },
  post: async (url: string, data?: any, config: AxiosRequestConfig = {}) => {
    await setHeaders(config);
    return axiosInstance.post(url, data, config);
  },
  put: (url: string, data?: any, config: AxiosRequestConfig = {}) => {
    setHeaders(config);
    return axiosInstance.put(url, data, config);
  },
  patch: (url: string, data?: any, config: AxiosRequestConfig = {}) => {
    setHeaders(config);
    return axiosInstance.patch(url, data, config);
  },
  delete: (url: string, config: AxiosRequestConfig = {}) => {
    setHeaders(config);
    return axiosInstance.delete(url, config);
  },
};
