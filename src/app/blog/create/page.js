import CreateBlogForm from "@/components/blog/CreateBlog";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function CreateBlogPage() {

  const token = (await cookies()).get("token")?.value;

  const user = await verifyAuth(token);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create a New Blog</h1>
      </header>
      <CreateBlogForm user={user} />
    </div>
  );
} 