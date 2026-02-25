export type AttendanceStatus = "present" | "absent" | "not_checked_in";

export interface AttendanceRecord {
  id: string;
  childId: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
}

export const mockAttendance: AttendanceRecord[] = [
  // Schmetterlinge
  { id: "a1", childId: "c1", date: "2025-02-19", status: "present", checkInTime: "07:45" },
  { id: "a2", childId: "c2", date: "2025-02-19", status: "present", checkInTime: "08:10" },
  { id: "a3", childId: "c3", date: "2025-02-19", status: "absent" },
  { id: "a4", childId: "c4", date: "2025-02-19", status: "present", checkInTime: "08:00" },
  { id: "a5", childId: "c5", date: "2025-02-19", status: "present", checkInTime: "08:15" }, // Emma: 13mo = 1.5 spots
  // Bären
  { id: "a6", childId: "c6", date: "2025-02-19", status: "present", checkInTime: "07:55" },
  { id: "a7", childId: "c7", date: "2025-02-19", status: "present", checkInTime: "08:20" },
  { id: "a8", childId: "c8", date: "2025-02-19", status: "absent" },
  { id: "a9", childId: "c9", date: "2025-02-19", status: "present", checkInTime: "08:05" },
  { id: "a10", childId: "c10", date: "2025-02-19", status: "present", checkInTime: "08:10" },
  // Igel
  { id: "a11", childId: "c11", date: "2025-02-19", status: "present", checkInTime: "08:25" },
  { id: "a12", childId: "c12", date: "2025-02-19", status: "absent" },
  { id: "a13", childId: "c13", date: "2025-02-19", status: "present", checkInTime: "08:00" },
  { id: "a14", childId: "c14", date: "2025-02-19", status: "present", checkInTime: "07:40" },
];
