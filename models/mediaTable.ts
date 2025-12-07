import type { MediaType } from "@/prisma/generated/client";

export type MediaTableProp = {
  id: string;
  title: string;
  type: MediaType;
  exists: Boolean;
  authorName: string;
  rented: Boolean;
  locationName: string;
};
