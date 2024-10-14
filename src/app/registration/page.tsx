"use client";

import Link from "next/link";
import Button from "@/components/button";
import Input from "@/components/input";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { AuthService } from "@/services/auth.service";
import cn from "classnames";

interface IFormInput {
  email: string;
  name: string;
  password: string;
}

const INPUTS = {
  name: {
    required: "Name is required",
  },
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
    await AuthService.registerUser(data);
    router.push("/songs");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-3/4 md:w-[500px] mx-auto mt-[calc(50vh-200px)]"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Registration</h1>
        <Link className="link" href="/login">
          Login
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
          register: register("name", INPUTS["name"]),
          label: "Name",
          error: errors["name"],
        }}
      />
      <Input
        {...{
          register: register("password", INPUTS["password"]),
          label: "Password",
          type: "password",
          error: errors["password"],
        }}
      />
      <Button className="w-full mt-4" type="submit">
        Register
      </Button>
    </form>
  );
}
