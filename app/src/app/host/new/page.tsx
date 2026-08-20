import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewPropertyForm from "@/components/NewPropertyForm";

export default async function NewPropertyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/host/new");
  if (session.user.role !== "HOST") redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">List a new property</h1>
      <NewPropertyForm />
    </div>
  );
}
