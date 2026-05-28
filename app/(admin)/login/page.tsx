import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Admin Login | Noble Grounds",
  description: "Secure Noble Grounds admin login.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-svh items-center bg-cream py-10">
      <Container className="max-w-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-noble-green-800 text-ivory shadow-[0_12px_30px_rgb(18_50_38_/_0.2)]">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-serif text-3xl font-semibold text-noble-green-950">
              Noble Grounds
            </p>
            <p className="text-sm font-medium text-sage-700">Admin access</p>
          </div>
        </div>

        <Card className="p-5 md:p-7">
          <h1 className="font-serif text-5xl font-semibold text-noble-green-950">
            Login
          </h1>
          <p className="mt-3 text-sm leading-7 text-noble-green-700">
            Sign in with the Supabase admin account to manage public gallery
            images.
          </p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </Card>
      </Container>
    </main>
  );
}
