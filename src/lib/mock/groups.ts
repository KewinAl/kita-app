export interface KitaGroup {
  id: string;
  name: string;
  locationId: string;
  /** Age band as of opening day — documentation for staffing/spots demos. */
  ageBand: "over_18mo" | "mixed" | "under_18mo";
}

export const mockGroups: KitaGroup[] = [
  { id: "g1", name: "Schmetterlinge", locationId: "loc1", ageBand: "over_18mo" },
  { id: "g2", name: "Bären", locationId: "loc1", ageBand: "mixed" },
  { id: "g3", name: "Igel", locationId: "loc1", ageBand: "under_18mo" },
];
