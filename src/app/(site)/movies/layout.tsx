import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.movies;

export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
