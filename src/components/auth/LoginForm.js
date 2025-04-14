"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loginUserAction } from "@/actions/login";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 chracters long." }),
});

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await loginUserAction(formData);
      if (result.success) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        throw new Error(result.error || "Something wrong occured");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            {...register("email")}
            placeholder="Email"
            disabled={isLoading}
            className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <Key className="absolute left-2 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="password"
            {...register("password")}
            placeholder="Password"
            disabled={isLoading}
            className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Login
      </Button>
    </form>
  );
}

export default LoginForm;