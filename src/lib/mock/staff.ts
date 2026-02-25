export interface Staff {
  id: string;
  name: string;
  locationId: string;
}

export interface StaffBreak {
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export const mockStaff: Staff[] = [
  { id: "s1", name: "Maria S.", locationId: "loc1" },
  { id: "s2", name: "Thomas K.", locationId: "loc1" },
  { id: "s3", name: "Lisa M.", locationId: "loc1" },
];

export const mockStaffBreaks: StaffBreak[] = [
  { staffId: "s1", date: "2025-02-19", startTime: "10:00", endTime: "10:30" },
  { staffId: "s2", date: "2025-02-19", startTime: "11:30", endTime: "12:00" },
  { staffId: "s3", date: "2025-02-19", startTime: "14:00", endTime: "14:30" },
];
