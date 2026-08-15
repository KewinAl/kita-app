export type AttendanceStatus = "present" | "absent" | "not_checked_in";

export interface AttendanceRecord {
  id: string;
  childId: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
}
