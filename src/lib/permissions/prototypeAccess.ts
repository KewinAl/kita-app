export type PrototypeRole =
  | "technical_support"
  | "org_admin"
  | "kita_lead"
  | "general_staff"
  | "parent";

export const ROLE_LABELS: Record<PrototypeRole, string> = {
  technical_support: "Technical Support",
  org_admin: "Org Admin",
  kita_lead: "Kita Lead",
  general_staff: "General Staff",
  parent: "Parent",
};

const STAFF_ROLES: PrototypeRole[] = [
  "technical_support",
  "org_admin",
  "kita_lead",
  "general_staff",
];

export function isStaffRole(role: PrototypeRole) {
  return STAFF_ROLES.includes(role);
}

/** Leitung / Verwaltung: administrative Bereiche der Prototyp-Navigation. */
export function isLeadAdminRole(role: PrototypeRole) {
  return role === "kita_lead" || role === "org_admin";
}

/** Tabs, die nur für Leitung/Verwaltung gedacht sind (visuell hervorgehoben). */
export function isLeadAdminNavHref(href: string) {
  return (
    href === "/prototype/lead/appointments" ||
    href === "/prototype/lead/documents" ||
    href === "/prototype/lead/kids" ||
    href === "/prototype/lead/settings"
  );
}

export function canAccessRoute(role: PrototypeRole, pathname: string) {
  if (pathname === "/prototype") return true;
  if (pathname.startsWith("/prototype/parent")) return role === "parent";

  if (pathname === "/prototype/kids" || pathname.startsWith("/prototype/kids/")) {
    return isStaffRole(role);
  }

  if (pathname.startsWith("/prototype/lead/shifts")) {
    return isStaffRole(role);
  }

  if (
    pathname === "/prototype/lead/kids/check" ||
    pathname.startsWith("/prototype/lead/kids/check/")
  ) {
    return isStaffRole(role);
  }

  if (pathname === "/prototype/lead/kids") {
    return isLeadAdminRole(role);
  }

  if (pathname.startsWith("/prototype/lead")) {
    return isLeadAdminRole(role);
  }
  if (
    pathname.startsWith("/prototype/group") ||
    pathname.startsWith("/prototype/check-in") ||
    pathname.startsWith("/prototype/check-out") ||
    pathname.startsWith("/prototype/ablauf") ||
    pathname.startsWith("/prototype/schedule") ||
    pathname.startsWith("/prototype/child-log") ||
    pathname.startsWith("/prototype/incident") ||
    pathname.startsWith("/prototype/photo")
  ) {
    return isStaffRole(role);
  }
  return false;
}

export function getDefaultPrototypePath(role: PrototypeRole) {
  if (role === "parent") return "/prototype/parent";
  if (role === "kita_lead" || role === "org_admin") return "/prototype/lead/shifts";
  return "/prototype/group";
}
