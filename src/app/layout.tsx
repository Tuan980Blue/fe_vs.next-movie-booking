import type {Metadata} from "next";
import "../lib/styles/globals.css";
import AppProviders from "@/app/providers";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="vi">
        <head>
            <link rel="icon" href="/logo.png" type="image/png" />
            <link rel="shortcut icon" href="/logo.png" type="image/png" />
            <link rel="apple-touch-icon" href="/logo.png" />
        </head>
        <body>
        <AppProviders>
            {children}
        </AppProviders>
        </body>
        </html>
    );
}
