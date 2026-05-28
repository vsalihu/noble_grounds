export type QuoteEnquiryStatus = "new" | "contacted" | "quoted" | "closed";

export type QuoteEnquiry = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  property_area: string;
  customer_type: string;
  service_needed: string;
  message: string | null;
  source: string;
  status: QuoteEnquiryStatus | string;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  project_id: string | null;
  image_url: string;
  storage_path: string;
  title: string;
  description: string | null;
  location: string | null;
  alt_text: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
};

export type GalleryProject = {
  id: string;
  title: string;
  address: string;
  location: string | null;
  customer_type: string | null;
  description: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryProjectWithImages = GalleryProject & {
  gallery_images: GalleryImage[];
};
