"use server";
import prisma from "@/client";
import type { RentedMedia } from "@/client";
import { RentedMediaTableProp } from "@/models/rentedMediaTable";

export async function getRentedMediaByUserId(
  id: number,
): Promise<RentedMediaTableProp[] | null> {
  try {
    const rentedMedias = await prisma.rentedMedia.findMany({
      where: {
        userId: {
          equals: id,
        },
      },

      select: {
        id: true,
        mediaId: true,
        rentedAt: true,
        returnedAt: true,
        media: {
          select: {
            title: true,
            type: true,
          },
        },
      },
    });

    if (!rentedMedias) {
      return null;
    }

    const rentedMediaTableProp: RentedMediaTableProp[] = rentedMedias.map(
      (rentedMedia) => ({
        id: rentedMedia.id,
        mediaId: rentedMedia.mediaId,
        mediaTitle: rentedMedia.media.title,
        mediaType: rentedMedia.media.type,
        rentedAt: new Date(rentedMedia.rentedAt),
        returnedAt: rentedMedia.returnedAt
          ? new Date(rentedMedia.returnedAt)
          : null,
      }),
    );

    return rentedMediaTableProp;
  } catch (err) {
    return null;
  }
}

export async function updateRentedMediaById(
  id: number,
): Promise<RentedMedia | null> {
  try {
    const rentedMedia = await prisma.rentedMedia.update({
      where: {
        id: id,
      },
      data: {
        returnedAt: new Date(),
      },
    });

    return rentedMedia;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

export async function createRentedMedia(
  userId: number,
  mediaIds: string[],
): Promise<RentedMedia[] | null> {
  try {
    const rentedMedias = [];

    for (const mediaId of mediaIds) {
      const rentedMedia = await prisma.rentedMedia.create({
        data: {
          mediaId: mediaId,
          userId: userId,
          rentedAt: new Date(),
        },
      });

      rentedMedias.push(rentedMedia);
    }

    return rentedMedias;
  } catch (err) {
    //console.log(err);
    return null;
  }
}
