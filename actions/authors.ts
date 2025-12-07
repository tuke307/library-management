"use server";
import prisma from "@/client";
import type { Author } from "@/client";

export default async function getAllAuthors(): Promise<Author[] | null> {
  const authors = await prisma.author.findMany();

  return authors;
}
