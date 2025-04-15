import { cookies } from "next/headers";
import Header from "./header";
import { verifyAuth } from "@/lib/auth";

export default async function CommonLayout({ children }) {

  const token = (await cookies()).get("token")?.value;
  const isAuthenticated = await verifyAuth(token); 

  return (
    <div className="min-h-screen bg-white">
      {isAuthenticated && <Header />}
      { children }
    </div>
  );
}