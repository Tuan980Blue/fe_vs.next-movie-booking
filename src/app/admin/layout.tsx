import type { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.admin;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}