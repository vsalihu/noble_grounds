"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { GalleryProjectManager } from "@/components/admin/GalleryProjectManager";
import { PriceFactorsManager } from "@/components/admin/PriceFactorsManager";
import { QuoteEnquiryManager } from "@/components/admin/QuoteEnquiryManager";
import { ReviewManager } from "@/components/admin/ReviewManager";
import { ServicesContentManager } from "@/components/admin/ServicesContentManager";
import { SiteContentManager } from "@/components/admin/SiteContentManager";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { StatusMessage } from "@/components/ui/StatusMessage";
import {
  fetchAdminPriceFactors,
  fetchAdminServices,
  fetchAdminSiteContent,
} from "@/lib/cms";
import { fetchQuoteEnquiries } from "@/lib/quote-enquiries";
import { sortReviews } from "@/lib/reviews";
import { supabase } from "@/lib/supabase/client";
import type {
  EditableService,
  GalleryProjectWithComparisons,
  PriceFactor,
  QuoteEnquiry,
  Review,
  SiteContent,
} from "@/types/supabase";

type AdminTab = "gallery" | "reviews" | "quotes" | "site" | "services" | "prices";

export function AdminDashboardShell() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<GalleryProjectWithComparisons[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quoteEnquiries, setQuoteEnquiries] = useState<QuoteEnquiry[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [services, setServices] = useState<EditableService[]>([]);
  const [priceFactors, setPriceFactors] = useState<PriceFactor[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("gallery");
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
    setSelectedProjectId((current) =>
      current && nextProjects.some((project) => project.id === current)
        ? current
        : null,
    );
  }, []);

  const loadReviews = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("reviews")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    setReviews(sortReviews((data ?? []) as Review[]));
  }, []);

  const loadQuoteEnquiries = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const result = await fetchQuoteEnquiries(supabase);

    if (result.error) {
      setError(result.error);
      return;
    }

    setQuoteEnquiries(result.data);
  }, []);

  const loadSiteContent = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const result = await fetchAdminSiteContent(supabase);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSiteContent(result.data);
  }, []);

  const loadServices = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const result = await fetchAdminServices(supabase);

    if (result.error) {
      setError(result.error);
      return;
    }

    setServices(result.data);
  }, []);

  const loadPriceFactors = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const result = await fetchAdminPriceFactors(supabase);

    if (result.error) {
      setError(result.error);
      return;
    }

    setPriceFactors(result.data);
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
      await Promise.all([
        loadProjects(),
        loadReviews(),
        loadQuoteEnquiries(),
        loadSiteContent(),
        loadServices(),
        loadPriceFactors(),
      ]);
      setIsLoading(false);
    }

    void checkAuth();
  }, [
    loadPriceFactors,
    loadProjects,
    loadQuoteEnquiries,
    loadReviews,
    loadServices,
    loadSiteContent,
    router,
  ]);

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
          <div className="grid gap-5">
            <LoadingSpinner label="Checking admin access" />
            <div className="grid gap-4 md:grid-cols-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
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
              Admin dashboard
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
          <div className="mt-6">
            <StatusMessage tone="error">{error}</StatusMessage>
          </div>
        ) : null}

        <div className="mt-8 grid gap-3 rounded-2xl border border-border-soft bg-white/70 p-2 shadow-[var(--shadow-soft)] min-[430px]:grid-cols-2 lg:grid-cols-3">
          <Button
            type="button"
            variant={activeTab === "gallery" ? "primary" : "ghost"}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery Projects
          </Button>
          <Button
            type="button"
            variant={activeTab === "reviews" ? "primary" : "ghost"}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </Button>
          <Button
            type="button"
            variant={activeTab === "quotes" ? "primary" : "ghost"}
            onClick={() => setActiveTab("quotes")}
          >
            Quote Enquiries
          </Button>
          <Button
            type="button"
            variant={activeTab === "site" ? "primary" : "ghost"}
            onClick={() => setActiveTab("site")}
          >
            Site Content
          </Button>
          <Button
            type="button"
            variant={activeTab === "services" ? "primary" : "ghost"}
            onClick={() => setActiveTab("services")}
          >
            Services
          </Button>
          <Button
            type="button"
            variant={activeTab === "prices" ? "primary" : "ghost"}
            onClick={() => setActiveTab("prices")}
          >
            Price Factors
          </Button>
        </div>

        <div className="mt-8">
          {activeTab === "gallery" ? (
            <GalleryProjectManager
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onChanged={loadProjects}
            />
          ) : activeTab === "reviews" ? (
            <ReviewManager reviews={reviews} onChanged={loadReviews} />
          ) : activeTab === "quotes" ? (
            <QuoteEnquiryManager
              enquiries={quoteEnquiries}
              onChanged={loadQuoteEnquiries}
            />
          ) : activeTab === "site" ? (
            <SiteContentManager sections={siteContent} onChanged={loadSiteContent} />
          ) : activeTab === "services" ? (
            <ServicesContentManager services={services} onChanged={loadServices} />
          ) : (
            <PriceFactorsManager
              factors={priceFactors}
              onChanged={loadPriceFactors}
            />
          )}
        </div>
      </Container>
    </main>
  );
}
