"use server";
import prisma from "@/client";
import type { User } from "@/client";

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  houseNumber: string;
  plz: number;
  city: string;
}

export async function createUser(user: ICreateUser): Promise<User | null> {
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        street: user.street,
        houseNumber: user.houseNumber,
        plz: Number(user.plz),
        city: user.city,
      },
    });

    return newUser;
  } catch (err) {
    //console.log(err);
    return null;
  }
}

export async function getAllUsers(): Promise<User[] | null> {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (err) {
    //console.log(err);
    return null;
  }
}
