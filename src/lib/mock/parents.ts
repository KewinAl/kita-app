export interface ParentAccount {
  id: string;
  name: string;
  childIds: string[];
}

export const mockParentAccounts: ParentAccount[] = [
  { id: "p1", name: "Elternkonto Müller", childIds: ["c1"] },
  { id: "p2", name: "Elternkonto Keller", childIds: ["c2"] },
  { id: "p3", name: "Elternkonto Fischer", childIds: ["c5"] },
  { id: "p4", name: "Elternkonto Hoffmann", childIds: ["c11"] },
];
