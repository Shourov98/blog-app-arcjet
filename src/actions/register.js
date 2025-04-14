"use server";
import aj from "@/lib/arcjet";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { request } from "@arcjet/next";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(2, { message: "Name is required, atleast 2 character." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be atleast 6 character." }),
})


export async function registerUserAction(formData) {
  try {
    const validatedFields = schema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        status: 400,
        error: validatedFields.error.errors[0].message
      };
    }

    const { name, email, password } = validatedFields.data;

    const req = await request();
    const decision = await aj.protect(req, {
      email
    })

    if (decision.isDenied()) {
      if (decision.reason.isEmail()) {
        const emailTypes = decision.reason.emailTypes;
        if (emailTypes.includes("DISPOSABLE")) {
          return {
            error: "Disposable email addresses are not allowed",
            status: 403,
          };
        } else if (emailTypes.includes("INVALID")) {
          return {
            error: "Invalid Email address",
            status: 403,
          };
        } else if (emailTypes.includes("NO_MX_RECORDS")) {
          return {
            error: "Email domain does not have valid MX records",
            status: 403,
          };
        } else {
          return {
            error: "Email address is not accepted! Please try again",
            status: 403,
          };
        }
      } else if (decision.reason.isBot()) {
        return {
          error: "Bot activity detected",
          status: 403,
        };
      } else if (decision.reason.isRateLimit()) {
        return {
          success: false,
          error: "Too many requests! Please try again later",
          status: 403,
        };
      }
    }

    //database connection
    try {
      await connectToDatabase();
      // Your database operations here
    } catch (error) {
      console.error('Database operation failed:', error);
      throw error;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        error: "User already exists",
        status: 400,
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const result = new User({
      name,
      email,
      password: hashPassword,
    });

    await result.save();

    if (result) {
      return {
        success: "user registered successfully",
        status: 201,
      };
    } else {
      return {
        error: "Internal server error",
        status: 500,
      };
    }
    
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      success: false,
      status: 500,
      error: "Internal server error"
    };
  }
}