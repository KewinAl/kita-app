import { Suspense } from "react";
import { PrototypeNav } from "@/components/prototype/PrototypeNav";
import { PrototypeProvider } from "@/context/PrototypeContext";

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrototypeProvider>
      <div className="min-h-screen bg-muted/30">
        <Suspense fallback={<div className="h-10 border-b bg-background" />}>
          <PrototypeNav />
        </Suspense>
        {children}
      </div>
    </PrototypeProvider>
  );
}
