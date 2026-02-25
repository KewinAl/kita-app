"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface OrgTheme {
  id: string;
  name: string;
  tokens: Record<string, string>;
}

const ORG_THEMES: OrgTheme[] = [
  {
    id: "org-default",
    name: "Sonnengarten",
    tokens: {
      background: "44 100% 96%",
      foreground: "16 45% 14%",
      primary: "28 96% 48%",
      "primary-foreground": "0 0% 100%",
      secondary: "52 96% 82%",
      "secondary-foreground": "24 58% 18%",
      muted: "48 88% 88%",
      "muted-foreground": "22 30% 30%",
      accent: "334 90% 74%",
      "accent-foreground": "335 66% 20%",
      destructive: "0 72% 48%",
      "destructive-foreground": "0 0% 98%",
      border: "34 62% 70%",
      ring: "334 90% 74%",
      active: "22 72% 30%",
      "active-foreground": "0 0% 100%",
      card: "0 0% 100%",
      "card-foreground": "16 45% 14%",
    },
  },
  {
    id: "org-forest",
    name: "Waldkita",
    tokens: {
      background: "98 26% 92%",
      foreground: "132 38% 12%",
      primary: "126 58% 26%",
      "primary-foreground": "0 0% 100%",
      secondary: "90 28% 74%",
      "secondary-foreground": "132 35% 17%",
      muted: "96 18% 78%",
      "muted-foreground": "132 16% 27%",
      accent: "168 34% 56%",
      "accent-foreground": "145 40% 16%",
      destructive: "0 70% 55%",
      "destructive-foreground": "0 0% 98%",
      border: "100 18% 62%",
      ring: "168 34% 56%",
      active: "130 46% 24%",
      "active-foreground": "0 0% 100%",
      card: "0 0% 100%",
      "card-foreground": "132 38% 12%",
    },
  },
  {
    id: "org-lake",
    name: "Nachtblau",
    tokens: {
      background: "222 47% 11%",
      foreground: "210 40% 96%",
      primary: "196 100% 50%",
      "primary-foreground": "222 47% 11%",
      secondary: "217 32% 20%",
      "secondary-foreground": "210 40% 96%",
      muted: "217 32% 18%",
      "muted-foreground": "215 20% 75%",
      accent: "286 78% 60%",
      "accent-foreground": "0 0% 98%",
      destructive: "0 72% 51%",
      "destructive-foreground": "0 0% 98%",
      border: "217 27% 24%",
      ring: "286 78% 60%",
      active: "205 74% 34%",
      "active-foreground": "0 0% 100%",
      card: "222 43% 14%",
      "card-foreground": "210 40% 96%",
    },
  },
];

interface PrototypeThemeContextValue {
  orgThemes: OrgTheme[];
  selectedOrgId: string;
  setSelectedOrgId: (id: string) => void;
}

const PrototypeThemeContext = createContext<PrototypeThemeContextValue | null>(null);

const STORAGE_KEY = "prototype:selected-org-theme";

type ContrastRule = {
  background: string;
  foreground: string;
  minRatio: number;
  label: string;
};

const CONTRAST_RULES: ContrastRule[] = [
  { background: "background", foreground: "foreground", minRatio: 4.5, label: "Base text" },
  { background: "card", foreground: "card-foreground", minRatio: 4.5, label: "Card text" },
  { background: "primary", foreground: "primary-foreground", minRatio: 4.5, label: "Primary button text" },
  { background: "secondary", foreground: "secondary-foreground", minRatio: 4.5, label: "Secondary text" },
  { background: "accent", foreground: "accent-foreground", minRatio: 4.5, label: "Accent text" },
  { background: "destructive", foreground: "destructive-foreground", minRatio: 4.5, label: "Destructive text" },
  { background: "active", foreground: "active-foreground", minRatio: 4.5, label: "Active indicator text" },
  // Muted combinations are often used for helper labels, so keep a softer target.
  { background: "muted", foreground: "muted-foreground", minRatio: 3, label: "Muted helper text" },
];

function parseHslToken(value: string): [number, number, number] | null {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 3) return null;

  const h = Number(parts[0]);
  const s = Number(parts[1].replace("%", ""));
  const l = Number(parts[2].replace("%", ""));
  if ([h, s, l].some((v) => Number.isNaN(v))) return null;
  return [h, s / 100, l / 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp >= 1 && hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp >= 2 && hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp >= 3 && hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp >= 4 && hp < 5) [r1, g1, b1] = [x, 0, c];
  else if (hp >= 5 && hp < 6) [r1, g1, b1] = [c, 0, x];

  const m = l - c / 2;
  return [r1 + m, g1 + m, b1 + m];
}

function srgbChannelToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const rl = srgbChannelToLinear(r);
  const gl = srgbChannelToLinear(g);
  const bl = srgbChannelToLinear(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function validateThemeContrast(theme: OrgTheme): string[] {
  const issues: string[] = [];

  CONTRAST_RULES.forEach((rule) => {
    const bgToken = theme.tokens[rule.background];
    const fgToken = theme.tokens[rule.foreground];
    if (!bgToken || !fgToken) return;

    const bgHsl = parseHslToken(bgToken);
    const fgHsl = parseHslToken(fgToken);
    if (!bgHsl || !fgHsl) return;

    const bgRgb = hslToRgb(bgHsl[0], bgHsl[1], bgHsl[2]);
    const fgRgb = hslToRgb(fgHsl[0], fgHsl[1], fgHsl[2]);
    const ratio = contrastRatio(bgRgb, fgRgb);
    if (ratio < rule.minRatio) {
      issues.push(
        `${rule.label}: ${rule.background}/${rule.foreground} ratio ${ratio.toFixed(2)} < ${rule.minRatio}`
      );
    }
  });

  return issues;
}

export function PrototypeThemeProvider({ children }: { children: React.ReactNode }) {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(ORG_THEMES[0]!.id);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && ORG_THEMES.some((org) => org.id === saved)) {
      setSelectedOrgId(saved);
    }
  }, []);

  useEffect(() => {
    const selected = ORG_THEMES.find((org) => org.id === selectedOrgId) ?? ORG_THEMES[0]!;
    Object.entries(selected.tokens).forEach(([token, value]) => {
      document.documentElement.style.setProperty(`--${token}`, value);
    });
    window.localStorage.setItem(STORAGE_KEY, selected.id);
  }, [selectedOrgId]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    ORG_THEMES.forEach((theme) => {
      const issues = validateThemeContrast(theme);
      if (issues.length > 0) {
        console.warn(`[prototype-theme] Contrast issues in "${theme.name}"`, issues);
      }
    });
  }, []);

  const value = useMemo(
    () => ({ orgThemes: ORG_THEMES, selectedOrgId, setSelectedOrgId }),
    [selectedOrgId]
  );

  return (
    <PrototypeThemeContext.Provider value={value}>
      {children}
    </PrototypeThemeContext.Provider>
  );
}

export function usePrototypeTheme() {
  const ctx = useContext(PrototypeThemeContext);
  if (!ctx) throw new Error("usePrototypeTheme must be used within PrototypeThemeProvider");
  return ctx;
}
