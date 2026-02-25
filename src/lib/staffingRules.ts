import { Child, StaffRole } from "@/lib/mock";

export const DEFAULT_SPOTS_PER_STAFF = 6;
export const EFZ_QUALIFIED_ROLES: StaffRole[] = ["Miterzieher", "GL", "KL"];
const INFANT_MONTH_LIMIT = 18;

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1, 12, 0, 0));
}

function ageInMonths(dateOfBirth: string, onDate: string) {
  const dob = parseDateKey(dateOfBirth);
  const day = parseDateKey(onDate);
  let months =
    (day.getUTCFullYear() - dob.getUTCFullYear()) * 12 +
    (day.getUTCMonth() - dob.getUTCMonth());
  if (day.getUTCDate() < dob.getUTCDate()) months -= 1;
  return Math.max(0, months);
}

export function getSpotWeightForChild(child: Child, onDate: string) {
  return ageInMonths(child.dateOfBirth, onDate) <= INFANT_MONTH_LIMIT ? 1.5 : 1;
}

export function calculateSpots(children: Child[], onDate: string) {
  return children.reduce((sum, child) => sum + getSpotWeightForChild(child, onDate), 0);
}

export function isEfzQualified(role: StaffRole) {
  return EFZ_QUALIFIED_ROLES.includes(role);
}

export function calculateRequiredCoverage(totalSpots: number, spotsPerStaff: number) {
  return calculateRequiredCoverageWithOptions(totalSpots, spotsPerStaff, {
    enforceEfzRequirement: true,
    requireAdditionalStaffOverRatio: true,
  });
}

interface CoverageOptions {
  enforceEfzRequirement: boolean;
  requireAdditionalStaffOverRatio: boolean;
}

export function calculateRequiredCoverageWithOptions(
  totalSpots: number,
  spotsPerStaff: number,
  options: CoverageOptions
) {
  if (totalSpots <= 0) {
    return { requiredEfzStaff: 0, requiredTotalStaff: 0 };
  }

  const normalizedRatio = Math.max(1, spotsPerStaff);
  const ratioBasedStaff = Math.ceil(totalSpots / normalizedRatio);
  const requiredEfzStaff = options.enforceEfzRequirement ? ratioBasedStaff : 0;
  const baseTotal = options.enforceEfzRequirement ? requiredEfzStaff : ratioBasedStaff;
  const requiredTotalStaff =
    baseTotal +
    (options.requireAdditionalStaffOverRatio && totalSpots > normalizedRatio ? 1 : 0);

  return { requiredEfzStaff, requiredTotalStaff };
}
