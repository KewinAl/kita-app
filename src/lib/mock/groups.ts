export interface KitaGroup {
  id: string;
  name: string;
  locationId: string;
}

export const mockGroups: KitaGroup[] = [
  { id: "g1", name: "Schmetterlinge", locationId: "loc1" },
  { id: "g2", name: "Bären", locationId: "loc1" },
  { id: "g3", name: "Igel", locationId: "loc1" },
];
