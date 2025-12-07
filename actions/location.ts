"use server";
import prisma from "@/client";
import type { Location } from "@/client";

export default async function getAllFreeLocations(): Promise<Location[] | null> {
  const authors = await prisma.location.findMany({
    where: {
      media: null,
    },
  });

  return authors;
}
