import type {Metadata} from "next";
import "../lib/styles/globals.css";
import AppProviders from "@/app/providers";

export const metadata: Metadata = {
    title: "Touch Cinema",
    description: "Đặt vé xem phim",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body>
        <AppProviders>
            {children}
        </AppProviders>
        </body>
        </html>
    );
}
