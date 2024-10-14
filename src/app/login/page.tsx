"use client";

import { useState } from "react";
import Link from "next/link";
import GoogleIcon from "@mui/icons-material/Google";
import Button from "@/components/button";
import Input from "@/components/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { apiUrl, baseUrl } from "@/constants/paths";

interface IFormInput {
  email: string;
  password: string;
}

const INPUTS = {
  email: {
    required: "Email is required",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Entered value does not match email format",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Minimum length should be 6",
    },
  },
};

export default function Login() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    AuthService.loginUser(data).then(() => {
      router.push("/songs");
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-3/4 md:w-[500px] mx-auto mt-[calc(50vh-200px)]"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
        <Link className="link" href="/registration">
          Registration
        </Link>
      </div>
      <Input
        {...{
          register: register("email", INPUTS["email"]),
          label: "Email",
          error: errors["email"],
        }}
      />
      <Input
        {...{
          register: register("password", INPUTS["password"]),
          label: "Password",
          type: "password",
          error: errors["password"],
          autocomplete: "current-password",
        }}
      />
      <Button
        href={`${apiUrl}/auth/google?redirect=${encodeURIComponent(
          baseUrl || ""
        )}/songs`}
        variant="primaryOutline"
      >
        <GoogleIcon color="primary" className="!h-5" /> Google
      </Button>
      <Button className="w-full mt-4" type="submit">
        Login
      </Button>
    </form>
  );
}
