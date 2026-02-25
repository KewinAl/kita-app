"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PrototypeRole } from "@/lib/permissions/prototypeAccess";

interface PrototypeAuthContextValue {
  role: PrototypeRole;
  setRole: (role: PrototypeRole) => void;
}

const STORAGE_KEY = "prototype:selected-role";
const DEFAULT_ROLE: PrototypeRole = "general_staff";

const PrototypeAuthContext = createContext<PrototypeAuthContextValue | null>(null);

export function PrototypeAuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<PrototypeRole>(DEFAULT_ROLE);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as PrototypeRole | null;
    if (saved) setRole(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  const value = useMemo(() => ({ role, setRole }), [role]);

  return (
    <PrototypeAuthContext.Provider value={value}>{children}</PrototypeAuthContext.Provider>
  );
}

export function usePrototypeAuth() {
  const ctx = useContext(PrototypeAuthContext);
  if (!ctx) {
    throw new Error("usePrototypeAuth must be used within PrototypeAuthProvider");
  }
  return ctx;
}
