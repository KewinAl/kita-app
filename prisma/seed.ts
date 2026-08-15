import { PrismaClient, StaffRole, DaySchedule } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.organization.upsert({
    where: { id: "org1" },
    create: { id: "org1", name: "Demo Org", slug: "demo" },
    update: {},
  });

  await prisma.kitaLocation.upsert({
    where: { id: "loc1" },
    create: { id: "loc1", organizationId: "org1", name: "Kita Sonnenschein" },
    update: {},
  });

  const groups = [
    { id: "g1", name: "Schmetterlinge", sortOrder: 1 },
    { id: "g2", name: "Bären", sortOrder: 2 },
    { id: "g3", name: "Igel", sortOrder: 3 },
  ];
  for (const g of groups) {
    await prisma.kitaGroup.upsert({
      where: { id: g.id },
      create: { id: g.id, locationId: "loc1", name: g.name, sortOrder: g.sortOrder },
      update: { name: g.name, sortOrder: g.sortOrder },
    });
  }

  /** Mirrors src/lib/mock/children.ts as of opening day 2026-08-03. */
  const children: Array<{
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    groupId: string;
    daySchedule: DaySchedule;
  }> = [
    { id: "c1", firstName: "Anna", lastName: "Müller", dateOfBirth: "2021-03-15", groupId: "g1", daySchedule: "full" },
    { id: "c2", firstName: "Ben", lastName: "Keller", dateOfBirth: "2021-07-22", groupId: "g1", daySchedule: "morning_lunch" },
    { id: "c3", firstName: "Clara", lastName: "Schmidt", dateOfBirth: "2022-01-08", groupId: "g1", daySchedule: "morning" },
    { id: "c4", firstName: "David", lastName: "Roth", dateOfBirth: "2021-11-30", groupId: "g1", daySchedule: "full" },
    { id: "c5", firstName: "Emma", lastName: "Fischer", dateOfBirth: "2024-01-15", groupId: "g1", daySchedule: "lunch_afternoon" },
    { id: "c11", firstName: "Lina", lastName: "Hoffmann", dateOfBirth: "2022-03-01", groupId: "g1", daySchedule: "full" },
    { id: "c12", firstName: "Max", lastName: "Koch", dateOfBirth: "2021-08-17", groupId: "g1", daySchedule: "lunch_afternoon" },
    { id: "c13", firstName: "Nora", lastName: "Richter", dateOfBirth: "2021-06-25", groupId: "g1", daySchedule: "morning_lunch" },
    { id: "c14", firstName: "Oscar", lastName: "Klein", dateOfBirth: "2022-01-12", groupId: "g1", daySchedule: "full" },
    { id: "c15", firstName: "Pia", lastName: "Steiner", dateOfBirth: "2022-06-10", groupId: "g1", daySchedule: "full" },
    { id: "c16", firstName: "Quinn", lastName: "Baumann", dateOfBirth: "2021-10-08", groupId: "g1", daySchedule: "morning_lunch" },
    { id: "c6", firstName: "Finn", lastName: "Weber", dateOfBirth: "2021-05-12", groupId: "g2", daySchedule: "full" },
    { id: "c7", firstName: "Greta", lastName: "Meyer", dateOfBirth: "2022-02-14", groupId: "g2", daySchedule: "morning_lunch" },
    { id: "c8", firstName: "Hugo", lastName: "Wagner", dateOfBirth: "2021-09-03", groupId: "g2", daySchedule: "afternoon" },
    { id: "c9", firstName: "Ida", lastName: "Becker", dateOfBirth: "2021-12-20", groupId: "g2", daySchedule: "full" },
    { id: "c10", firstName: "Jonas", lastName: "Schulz", dateOfBirth: "2021-04-05", groupId: "g2", daySchedule: "morning" },
    { id: "c17", firstName: "Ruben", lastName: "Graf", dateOfBirth: "2022-04-20", groupId: "g2", daySchedule: "full" },
    { id: "c18", firstName: "Sofia", lastName: "Brunner", dateOfBirth: "2021-02-28", groupId: "g2", daySchedule: "morning_lunch" },
    { id: "c19", firstName: "Theo", lastName: "Knecht", dateOfBirth: "2025-06-15", groupId: "g2", daySchedule: "full" },
    { id: "c20", firstName: "Uma", lastName: "Vogel", dateOfBirth: "2025-04-01", groupId: "g2", daySchedule: "morning_lunch" },
    { id: "c21", firstName: "Viktor", lastName: "Ammann", dateOfBirth: "2025-08-20", groupId: "g2", daySchedule: "full" },
    { id: "c22", firstName: "Willow", lastName: "Meier", dateOfBirth: "2025-03-12", groupId: "g3", daySchedule: "full" },
    { id: "c23", firstName: "Xaver", lastName: "Suter", dateOfBirth: "2025-05-05", groupId: "g3", daySchedule: "full" },
    { id: "c24", firstName: "Yara", lastName: "Frei", dateOfBirth: "2025-07-18", groupId: "g3", daySchedule: "morning_lunch" },
    { id: "c25", firstName: "Zoe", lastName: "Brun", dateOfBirth: "2025-09-02", groupId: "g3", daySchedule: "full" },
    { id: "c26", firstName: "Arthur", lastName: "Gross", dateOfBirth: "2025-10-22", groupId: "g3", daySchedule: "full" },
    { id: "c27", firstName: "Bianca", lastName: "Hofstetter", dateOfBirth: "2025-11-30", groupId: "g3", daySchedule: "morning_lunch" },
    { id: "c28", firstName: "Cedric", lastName: "Jenni", dateOfBirth: "2025-12-15", groupId: "g3", daySchedule: "full" },
    { id: "c29", firstName: "Daria", lastName: "Kaufmann", dateOfBirth: "2026-01-20", groupId: "g3", daySchedule: "full" },
    { id: "c30", firstName: "Elio", lastName: "Lang", dateOfBirth: "2026-02-10", groupId: "g3", daySchedule: "morning_lunch" },
  ];

  for (const c of children) {
    await prisma.child.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        dateOfBirth: c.dateOfBirth,
        groupId: c.groupId,
        daySchedule: c.daySchedule,
      },
      update: {
        firstName: c.firstName,
        lastName: c.lastName,
        dateOfBirth: c.dateOfBirth,
        groupId: c.groupId,
        daySchedule: c.daySchedule,
      },
    });
  }

  const staff: Array<{
    id: string;
    name: string;
    role: StaffRole;
    locationId: string;
    primaryGroupId?: string;
  }> = [
    { id: "s0", name: "Nina L.", role: "KL", locationId: "loc1" },
    { id: "s4", name: "Noah B.", role: "Miterzieher", locationId: "loc1" },
    { id: "s6", name: "Tim R.", role: "Praktikant", locationId: "loc1" },
    { id: "s12", name: "Lara F.", role: "Miterzieher", locationId: "loc1" },
    { id: "s1", name: "Maria S.", role: "GL", locationId: "loc1", primaryGroupId: "g1" },
    { id: "s13", name: "Elena W.", role: "Miterzieher", locationId: "loc1", primaryGroupId: "g1" },
    { id: "s5", name: "Lea P.", role: "Lernende", locationId: "loc1", primaryGroupId: "g1" },
    { id: "s2", name: "Thomas K.", role: "GL", locationId: "loc1", primaryGroupId: "g2" },
    { id: "s14", name: "Jonas H.", role: "Miterzieher", locationId: "loc1", primaryGroupId: "g2" },
    { id: "s8", name: "Milo A.", role: "Lernende", locationId: "loc1", primaryGroupId: "g2" },
    { id: "s3", name: "Lisa M.", role: "GL", locationId: "loc1", primaryGroupId: "g3" },
    { id: "s15", name: "Sophie R.", role: "Miterzieher", locationId: "loc1", primaryGroupId: "g3" },
    { id: "s16", name: "Marc D.", role: "Miterzieher", locationId: "loc1", primaryGroupId: "g3" },
    { id: "s11", name: "Nino C.", role: "Lernende", locationId: "loc1", primaryGroupId: "g3" },
  ];

  for (const s of staff) {
    await prisma.staff.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        name: s.name,
        role: s.role,
        locationId: s.locationId,
        primaryGroupId: s.primaryGroupId,
      },
      update: {
        name: s.name,
        role: s.role,
        locationId: s.locationId,
        primaryGroupId: s.primaryGroupId,
      },
    });
  }

  console.log("Seed completed: org, location, groups, children (30), staff (14).");
  console.log("Day logs / attendance stay in prototype mocks (historySeed) until DB wiring.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
