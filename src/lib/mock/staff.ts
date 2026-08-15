export type StaffRole = "KL" | "GL" | "Miterzieher" | "Lernende" | "Praktikant";

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  locationId: string;
  primaryGroupId?: string;
}

export interface StaffBreak {
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
}

/**
 * Coverage vs spots (ratio 6, +1 over ratio):
 * g1 11 spots → 3 staff (2 EFZ + Lernende)
 * g2 11.5 spots → 3 staff
 * g3 13.5 spots → 4 staff (3 EFZ + Lernende)
 */
export const mockStaff: Staff[] = [
  // Kita-level
  { id: "s0", name: "Nina L.", role: "KL", locationId: "loc1" },
  { id: "s4", name: "Noah B.", role: "Miterzieher", locationId: "loc1" },
  { id: "s6", name: "Tim R.", role: "Praktikant", locationId: "loc1" },
  { id: "s12", name: "Lara F.", role: "Miterzieher", locationId: "loc1" },

  // Schmetterlinge (g1)
  { id: "s1", name: "Maria S.", role: "GL", locationId: "loc1", primaryGroupId: "g1" },
  { id: "s13", name: "Elena W.", role: "Miterzieher", locationId: "loc1", primaryGroupId: "g1" },
  { id: "s5", name: "Lea P.", role: "Lernende", locationId: "loc1", primaryGroupId: "g1" },

  // Bären (g2)
  { id: "s2", name: "Thomas K.", role: "GL", locationId: "loc1", primaryGroupId: "g2" },
  { id: "s14", name: "Jonas H.", role: "Miterzieher", locationId: "loc1", primaryGroupId: "g2" },
  { id: "s8", name: "Milo A.", role: "Lernende", locationId: "loc1", primaryGroupId: "g2" },

  // Igel (g3) — infant group needs more EFZ coverage
  { id: "s3", name: "Lisa M.", role: "GL", locationId: "loc1", primaryGroupId: "g3" },
  { id: "s15", name: "Sophie R.", role: "Miterzieher", locationId: "loc1", primaryGroupId: "g3" },
  { id: "s16", name: "Marc D.", role: "Miterzieher", locationId: "loc1", primaryGroupId: "g3" },
  { id: "s11", name: "Nino C.", role: "Lernende", locationId: "loc1", primaryGroupId: "g3" },
];

/** Break templates expanded per history day in historySeed.ts */
export const mockStaffBreakTemplates: Omit<StaffBreak, "date">[] = [
  { staffId: "s0", startTime: "12:30", endTime: "13:00" },
  { staffId: "s4", startTime: "12:45", endTime: "13:45" },
  { staffId: "s6", startTime: "13:15", endTime: "14:00" },
  { staffId: "s12", startTime: "12:30", endTime: "13:15" },
  { staffId: "s1", startTime: "12:30", endTime: "13:15" },
  { staffId: "s13", startTime: "13:00", endTime: "13:45" },
  { staffId: "s5", startTime: "13:00", endTime: "13:30" },
  { staffId: "s2", startTime: "12:30", endTime: "13:00" },
  { staffId: "s14", startTime: "12:45", endTime: "13:30" },
  { staffId: "s8", startTime: "13:00", endTime: "14:00" },
  { staffId: "s3", startTime: "12:30", endTime: "13:30" },
  { staffId: "s15", startTime: "12:45", endTime: "13:30" },
  { staffId: "s16", startTime: "13:15", endTime: "14:00" },
  { staffId: "s11", startTime: "13:00", endTime: "13:45" },
];
