import type { MediaType } from "@prisma/client";
import type { ReactNode } from "react";
import { BsDisc, BsMap, BsNewspaper, BsBook } from "react-icons/bs";

export const MEDIA_TYPE = {
  BOOK: "BOOK" as MediaType,
  CD: "CD" as MediaType,
  MAGAZINE: "MAGAZINE" as MediaType,
  MAP: "MAP" as MediaType,
} as const;

export const mediaTypesWithIcons = [
  {
    enum: MEDIA_TYPE.BOOK,
    label: "Buch",
    icon: <BsBook className="m-2" />,
  },
  {
    enum: MEDIA_TYPE.CD,
    label: "CD",
    icon: <BsDisc className="m-2" />,
  },
  {
    enum: MEDIA_TYPE.MAGAZINE,
    label: "Magazin",
    icon: <BsNewspaper className="m-2" />,
  },
  {
    enum: MEDIA_TYPE.MAP,
    label: "Karte",
    icon: <BsMap className="m-2" />,
  },
] satisfies Array<{ enum: MediaType; label: string; icon: ReactNode }>;
