/** Care / safety fields matching prisma ChildProfile; used in prototype lead tooling. */
export interface ChildCareProfile {
  allergies: string;
  medicalInfo: string;
  parentName: string;
  emergencyNumber: string;
  backupContactName: string;
  backupContactPhone: string;
  sleepRoutine: string;
}

export function emptyChildCareProfile(): ChildCareProfile {
  return {
    allergies: "",
    medicalInfo: "",
    parentName: "",
    emergencyNumber: "",
    backupContactName: "",
    backupContactPhone: "",
    sleepRoutine: "",
  };
}

function mergeProfile(partial?: Partial<ChildCareProfile>): ChildCareProfile {
  return { ...emptyChildCareProfile(), ...(partial ?? {}) };
}

/** Seed profiles: some incomplete on purpose for the Daten-Check demo. */
export const defaultMockChildProfiles: Record<string, Partial<ChildCareProfile>> = {
  c1: {
    allergies: "Keine bekannt",
    medicalInfo: "",
    parentName: "Maria Müller",
    emergencyNumber: "+41 79 111 22 33",
    backupContactName: "Thomas Müller",
    backupContactPhone: "+41 79 222 33 44",
    sleepRoutine: "Mittagsschlaf ca. 13:00–15:00 Uhr, Schnuffeltuch.",
  },
  c2: {
    allergies: "Erdnüsse",
    medicalInfo: "Notfallmedikation bei Betreuerin",
    parentName: "Sam Keller",
    emergencyNumber: "+41 78 333 44 55",
    sleepRoutine: "",
  },
  c3: {
    allergies: "Keine",
    parentName: "",
    emergencyNumber: "",
    sleepRoutine: "Schläft selten mittags; kurze Ruhephase reicht.",
  },
  c4: {
    allergies: "",
    medicalInfo: "",
    parentName: "Sandra Roth",
    emergencyNumber: "+41 77 444 55 66",
    sleepRoutine: "Regelmässiger Mittagsschlaf.",
  },
  c5: {
    allergies: "Keine bekannt",
    parentName: "Julia Fischer",
    emergencyNumber: "+41 79 555 66 77",
    sleepRoutine: "Noch variabel; abstillen beachten.",
  },
};

export function initialChildProfilesMap(
  childIds: string[]
): Record<string, ChildCareProfile> {
  return Object.fromEntries(
    childIds.map((id) => [
      id,
      mergeProfile(defaultMockChildProfiles[id]),
    ])
  );
}

export function stammdatenComplete(child: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  groupId: string;
  daySchedule?: string;
}): boolean {
  return (
    !!child.firstName?.trim() &&
    !!child.lastName?.trim() &&
    !!child.dateOfBirth?.trim() &&
    !!child.groupId &&
    !!child.daySchedule
  );
}

/** Mind. Allergien oder medizinische Angaben (auch „keine“) dokumentiert. */
export function healthComplete(p: ChildCareProfile): boolean {
  return !!(p.allergies.trim() || p.medicalInfo.trim());
}

export function emergencyComplete(p: ChildCareProfile): boolean {
  return !!(p.emergencyNumber.trim() && p.parentName.trim());
}

export function sleepComplete(p: ChildCareProfile): boolean {
  return !!p.sleepRoutine.trim();
}
