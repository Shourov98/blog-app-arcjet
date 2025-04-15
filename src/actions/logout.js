"use server";

import { cookies } from "next/headers";
import { use } from "react";

export async function logoutUserAction() {
  try {
    (await cookies()).delete("token", {path: "/"});
    return {
      success: true,
      message: "Logout successful",
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error during logout, Please try after sometime.",
      status: 500,
    };
    
  }
}