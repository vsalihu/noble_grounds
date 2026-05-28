import type { Metadata } from "next";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";

export const metadata: Metadata = {
  title: "Admin Dashboard | Noble Grounds",
  description: "Manage Noble Grounds gallery images.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardShell />;
}
