import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.movieDetail;

export default function MovieDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
