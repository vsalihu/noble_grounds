import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { GalleryProjectWithImages } from "@/types/supabase";

export function GalleryProjectCard({
  project,
}: {
  project: GalleryProjectWithImages;
}) {
  return (
    <Card className="overflow-hidden p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {project.is_featured ? (
              <span className="rounded-md bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-noble-green-800">
                Featured
              </span>
            ) : null}
            {project.customer_type ? (
              <span className="rounded-md border border-border-soft bg-cream px-3 py-1 text-xs font-semibold text-noble-green-700">
                {project.customer_type}
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-noble-green-950">
            {project.title}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-sage-700">
            <MapPin className="size-4" />
            {project.address}
          </p>
          {project.description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-noble-green-700">
              {project.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-3 min-[430px]:grid-cols-2 lg:grid-cols-3">
        {project.gallery_images.map((image) => (
          <div
            key={image.id}
            className="group overflow-hidden rounded-md border border-border-soft bg-sage-100"
          >
            <div className="aspect-[4/3] overflow-hidden">
              {image.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div
                  className="flex h-full items-end bg-[linear-gradient(135deg,#0b2118,#123226_42%,#697a58_78%,#e8d7c2)] p-4"
                  role="img"
                  aria-label={image.alt_text}
                >
                  <span className="rounded-md bg-ivory/90 px-3 py-2 text-sm font-semibold text-noble-green-900">
                    Photos coming soon
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
