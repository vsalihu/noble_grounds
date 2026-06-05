import type { MetadataRoute } from "next";
import { serviceAreas } from "@/data/serviceAreas";
import { absoluteUrl } from "@/lib/seo";

const routes = [
  "",
  "/services",
  "/prices",
  "/gallery",
  "/about",
  "/reviews",
  "/faq",
  "/contact",
  "/service-areas",
  "/privacy-policy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const serviceAreaRoutes = serviceAreas.map((area) => `/service-areas/${area.slug}`);

  return [...routes, ...serviceAreaRoutes].map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/contact"
          ? 0.9
          : route.startsWith("/service-areas/")
            ? 0.82
            : 0.8,
  }));
}

export const dynamic = "force-static";
