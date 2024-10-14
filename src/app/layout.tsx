import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Toaster } from "sonner";
import { GlobalProvider } from "../providers/global-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Songs app",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </ReactQueryProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              title: "text-white",
              description: "text-white",
              icon: "text-white",
              error: "bg-red-400",
              success: "bg-green-400",
              warning: "text-yellow-400",
              info: "bg-blue-400",
            },
          }}
        />
      </body>
    </html>
  );
}
