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

export const mockStaff: Staff[] = [
  // Kita-level
  { id: "s0", name: "Nina L.", role: "KL", locationId: "loc1" },
  { id: "s4", name: "Noah B.", role: "Miterzieher", locationId: "loc1" },
  { id: "s6", name: "Tim R.", role: "Praktikant", locationId: "loc1" },

  // Group g1
  { id: "s1", name: "Maria S.", role: "GL", locationId: "loc1", primaryGroupId: "g1" },
  { id: "s5", name: "Lea P.", role: "Lernende", locationId: "loc1", primaryGroupId: "g1" },

  // Group g2
  { id: "s2", name: "Thomas K.", role: "GL", locationId: "loc1", primaryGroupId: "g2" },
  { id: "s8", name: "Milo A.", role: "Lernende", locationId: "loc1", primaryGroupId: "g2" },

  // Group g3
  { id: "s3", name: "Lisa M.", role: "GL", locationId: "loc1", primaryGroupId: "g3" },
  { id: "s11", name: "Nino C.", role: "Lernende", locationId: "loc1", primaryGroupId: "g3" },
];

export const mockStaffBreaks: StaffBreak[] = [
  // KL
  { staffId: "s0", date: "2025-02-19", startTime: "12:30", endTime: "13:00" },
  // Springer / Praktikant (kitaweit)
  { staffId: "s4", date: "2025-02-19", startTime: "12:45", endTime: "13:45" }, // 60
  { staffId: "s6", date: "2025-02-19", startTime: "13:15", endTime: "14:00" }, // 45

  // g1
  { staffId: "s1", date: "2025-02-19", startTime: "12:30", endTime: "13:15" }, // 45
  { staffId: "s5", date: "2025-02-19", startTime: "13:00", endTime: "13:30" }, // 30

  // g2
  { staffId: "s2", date: "2025-02-19", startTime: "12:30", endTime: "13:00" }, // 30
  { staffId: "s8", date: "2025-02-19", startTime: "13:00", endTime: "14:00" }, // 60

  // g3
  { staffId: "s3", date: "2025-02-19", startTime: "12:30", endTime: "13:30" }, // 60
  { staffId: "s11", date: "2025-02-19", startTime: "13:00", endTime: "13:45" }, // 45
];
