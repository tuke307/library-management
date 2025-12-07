import type {
  Author,
  Location,
  Media,
  MediaType,
  RentedMedia,
  User,
} from "@/prisma/generated/client";


export type MediaDetailProp = {
  mediaId: string | undefined,
  mediaTitle: string | undefined,
  mediaType: MediaType,
  mediaContent: string | undefined,
  mediaPublished: boolean,
  mediaISBN: string | undefined,
  mediaExists: boolean,
  mediaCreatedAt: Date | undefined,
  mediaUpdatedAt: Date | undefined,

  authorId: number | undefined,
  authorFirstName: string| undefined,
  authorLastName: string| undefined,
  authorBirthday: Date | undefined,
  authorEmail: string| undefined,

  locationId:  number | undefined,
  locationFloor: number | undefined,
  locationShelf: number | undefined,
  locationShelfSection: number | undefined,

  rentedMediaId: number | undefined,
  rentedMediaMediaId: string | undefined,
  rentedMediaUserId: number | undefined,
  rentedMediaUserLastName: string | undefined,
  rentedMediaUserFirstName: string | undefined,
  rentedMediaRentedDate: Date | undefined ,
  rentedMediaReturnDate: Date | undefined ,
};