import { Suspense } from "react";
import { PrototypeNav } from "@/components/prototype/PrototypeNav";
import { PrototypeRouteGuard } from "@/components/prototype/PrototypeRouteGuard";
import { PrototypeAuthProvider } from "@/context/PrototypeAuthContext";
import { PrototypeLeadProvider } from "@/context/PrototypeLeadContext";
import { PrototypeProvider } from "@/context/PrototypeContext";
import { PrototypeThemeProvider } from "@/context/PrototypeThemeContext";

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrototypeThemeProvider>
      <PrototypeAuthProvider>
        <PrototypeProvider>
          <PrototypeLeadProvider>
            <div className="min-h-screen bg-muted/30">
              <Suspense fallback={<div className="h-10 border-b bg-background" />}>
                <PrototypeNav />
              </Suspense>
              <PrototypeRouteGuard>{children}</PrototypeRouteGuard>
            </div>
          </PrototypeLeadProvider>
        </PrototypeProvider>
      </PrototypeAuthProvider>
    </PrototypeThemeProvider>
  );
}
