import React from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

export const metadata = {
  title: "KOKKIRI 관리자 센터",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
