"use client"
import { Key, Mail, User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from 'zod';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import { registerUserAction } from "@/actions/register";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, "Name is required, at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register, 
    handleSubmit, 
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      
      const response = await registerUserAction(formData);
      
      if (response.success) {
        toast.success("Registration successful!");
        router.push("/login");
      } else {
        toast.error(response.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-2 h-5 w-5 text-gray-500" />
        <Input 
          {...register("name")}
          placeholder="Name"
          disabled={isLoading}
          className='pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500' 
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
        )}
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        <Input
          {...register("email")}
          placeholder="Email" 
          type="email"
          disabled={isLoading}
          className='pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500' 
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
        )}
      </div>

      <div className="relative">
        <Key className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          disabled={isLoading} 
          className='pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500' 
        />
        {errors.password && (
          <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
        )}
      </div>
      
      <Button
        type="submit"
        disabled={isLoading} 
        className='w-full hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105'
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}

export default RegisterForm;
