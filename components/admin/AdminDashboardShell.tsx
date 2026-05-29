"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { GalleryProjectManager } from "@/components/admin/GalleryProjectManager";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase/client";
import type { GalleryProjectWithComparisons } from "@/types/supabase";

export function AdminDashboardShell() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<GalleryProjectWithComparisons[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("gallery_projects")
      .select("*, gallery_comparisons(*)")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    const nextProjects = ((data ?? []) as GalleryProjectWithComparisons[]).map(
      (project) => ({
        ...project,
        gallery_comparisons: [...(project.gallery_comparisons ?? [])].sort((a, b) => {
          if (a.display_order !== b.display_order) {
            return a.display_order - b.display_order;
          }

          return b.created_at.localeCompare(a.created_at);
        }),
      }),
    );

    setProjects(nextProjects);
    setSelectedProjectId((current) => current ?? nextProjects[0]?.id ?? null);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      if (!supabase) {
        setError("Supabase is not configured yet.");
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      // UI gate only. Supabase RLS remains the security boundary for gallery
      // writes, so non-admin users cannot manage images even if this page loads.
      if (data.user.app_metadata?.role !== "admin") {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      setUser(data.user);
      await loadProjects();
      setIsLoading(false);
    }

    void checkAuth();
  }, [loadProjects, router]);

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/login");
  }

  if (isLoading) {
    return (
      <main className="min-h-svh bg-cream py-10">
        <Container>
          <Card className="p-6">Checking admin access...</Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-cream py-6 md:py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-700">
              Noble Grounds Admin
            </p>
            <h1 className="mt-2 font-serif text-5xl font-semibold text-noble-green-950">
              Gallery dashboard
            </h1>
            <p className="mt-3 text-sm text-noble-green-700">
              Signed in as {user?.email}
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>

        {error ? (
          <div
            className="mt-6 rounded-md border border-earth-200 bg-earth-200/35 px-4 py-3 text-sm font-medium text-earth-700"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-8">
          <GalleryProjectManager
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onChanged={loadProjects}
          />
        </div>
      </Container>
    </main>
  );
}
