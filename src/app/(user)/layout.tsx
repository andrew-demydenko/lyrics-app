import type { Metadata } from "next";
import { AuthProvider } from "@/providers/auth-provider";
import TopBar from "@/components/top-bar";

export const metadata: Metadata = {
  title: "Songs page",
  description: "",
};

export default function SongsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="h-full flex flex-col">
        <TopBar />
        <div className="container w-full mx-auto flex-1 min-h-0">
          <div className="h-full bg-gray-100 p-6">
            <div className="h-full bg-white rounded-lg shadow-lg p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
