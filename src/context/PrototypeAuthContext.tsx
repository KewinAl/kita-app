"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PrototypeRole } from "@/lib/permissions/prototypeAccess";
import { mockParentAccounts } from "@/lib/mock";

interface PrototypeAuthContextValue {
  role: PrototypeRole;
  setRole: (role: PrototypeRole) => void;
  parentAccountId: string;
  setParentAccountId: (accountId: string) => void;
}

const ROLE_STORAGE_KEY = "prototype:selected-role";
const PARENT_ACCOUNT_STORAGE_KEY = "prototype:selected-parent-account";
const DEFAULT_ROLE: PrototypeRole = "general_staff";
const DEFAULT_PARENT_ACCOUNT_ID = mockParentAccounts[0]?.id ?? "";

const PrototypeAuthContext = createContext<PrototypeAuthContextValue | null>(null);

export function PrototypeAuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<PrototypeRole>(DEFAULT_ROLE);
  const [parentAccountId, setParentAccountId] = useState<string>(DEFAULT_PARENT_ACCOUNT_ID);

  useEffect(() => {
    const saved = window.localStorage.getItem(ROLE_STORAGE_KEY) as PrototypeRole | null;
    if (saved) setRole(saved);

    const savedParentAccountId = window.localStorage.getItem(PARENT_ACCOUNT_STORAGE_KEY);
    if (savedParentAccountId && mockParentAccounts.some((entry) => entry.id === savedParentAccountId)) {
      setParentAccountId(savedParentAccountId);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  }, [role]);

  useEffect(() => {
    window.localStorage.setItem(PARENT_ACCOUNT_STORAGE_KEY, parentAccountId);
  }, [parentAccountId]);

  const value = useMemo(
    () => ({ role, setRole, parentAccountId, setParentAccountId }),
    [role, parentAccountId]
  );

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
