import { axiosWrapper } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import Cookie from "js-cookie";
import { EnumTokens } from "@/constants/auth";
import { NextResponse } from "next/server";

export const AuthService = {
  async registerUser(data: { name: string; email: string; password: string }) {
    return axiosWrapper
      .post("/auth/register", data)
      .then((response: AxiosResponse<{ accessToken: string }>) => {
        this.setAccessToken(response.data.accessToken);
      })
      .catch(function (e) {
        toast.error(`${e}`);
        throw new Error(e);
      });
  },

  async loginUser({ email, password }: { email: string; password: string }) {
    return axiosWrapper
      .post(`auth/login`, {
        email,
        password,
      })
      .then((response: AxiosResponse<{ accessToken: string }>) => {
        this.setAccessToken(response.data.accessToken);
      })
      .catch((e) => {
        toast.error(`Invalid email or password`);
        throw new Error(e);
      });
  },

  async logout(userId: string) {
    return axiosWrapper
      .post(`auth/logout`, { userId })
      .then(() => {
        Cookie.remove(EnumTokens.ACCESS_TOKEN);
      })
      .catch((e) => {
        toast.error("Something went wrong");
        throw new Error(e);
      });
  },

  setAccessToken(token: string, res?: NextResponse) {
    const options = {
      secure: false,
      sameSite: "strict",
      expires: new Date(new Date().getTime() + 15 * 60 * 1000),
    } as const;
    if (res) {
      res.cookies.set({
        ...options,
        name: EnumTokens.ACCESS_TOKEN,
        value: token,
      });
    } else {
      Cookie.set(EnumTokens.ACCESS_TOKEN, token, options);
    }
  },
};
