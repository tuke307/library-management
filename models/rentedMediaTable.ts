import type { MediaType } from "@/prisma/generated/client";

export type RentedMediaTableProp = {
  id: number;
  mediaId: string;
  mediaTitle: string;
  mediaType: MediaType;
  rentedAt: Date;
  returnedAt: Date | null;
};
