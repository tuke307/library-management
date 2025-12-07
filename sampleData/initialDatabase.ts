import prisma from "@/client";
import path from "path";
import fs from "fs";

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "users.json"), "utf8"),
);

const employees = JSON.parse(
  fs.readFileSync(path.join(__dirname, "employees.json"), "utf8"),
);

const authors = JSON.parse(
  fs.readFileSync(path.join(__dirname, "authors.json"), "utf8"),
);

const locations = JSON.parse(
  fs.readFileSync(path.join(__dirname, "locations.json"), "utf8"),
);

const media = JSON.parse(
  fs.readFileSync(path.join(__dirname, "medias.json"), "utf8"),
);

const rentedMedia = JSON.parse(
  fs.readFileSync(path.join(__dirname, "rentedMedias.json"), "utf8"),
);

async function main() {
  //await cleanupDatabase();

  await createUsers();
  await createEmployees();
  await createAuthors();
  await createLocations();
  await createMedia();
  await createRentedMedia();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function cleanupDatabase() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
}

async function createUsers() {
  for (const user of users) {
    const newUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        email: user.email,
        street: user.street,
        houseNumber: user.houseNumber,
        plz: user.plz,
        city: user.city,
      },
    });
    console.log(`Created user with id: ${newUser.id}`);
  }
}

async function createEmployees() {
  for (const employee of employees) {
    const newEmployee = await prisma.employee.create({
      data: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        password: employee.password,
      },
    });
    console.log(`Created employee with id: ${newEmployee.id}`);
  }
}

async function createAuthors() {
  for (const author of authors) {
    const newAuthor = await prisma.author.create({
      data: {
        firstName: author.firstName,
        lastName: author.lastName,
        birthday: author.birthday,
      },
    });
    console.log(`Created author with id: ${newAuthor.id}`);
  }
}

async function createLocations() {
  for (const location of locations) {
    const newLocation = await prisma.location.create({
      data: {
        floor: location.floor,
        shelf: location.shelf,
        shelfSection: location.shelfSection,
      },
    });
    console.log(`Created location with id: ${newLocation.id}`);
  }
}

async function createMedia() {
  for (const medium of media) {
    const newMedium = await prisma.media.create({
      data: {
        id: medium.id, // normally autoincremented
        title: medium.title,
        type: medium.type,
        updatedAt: medium.updatedAt,
        content: medium.content,
        published: medium.published,
        ISBN: medium.ISBN,
        authorId: medium.authorId,
        locationId: medium.locationId,
      },
    });
    console.log(`Created media with id: ${newMedium.id}`);
  }
}

async function createRentedMedia() {
  for (const rentedMedium of rentedMedia) {
    const newRentedMedium = await prisma.rentedMedia.create({
      data: {
        userId: rentedMedium.userId,
        mediaId: rentedMedium.mediaId,
        rentedAt: rentedMedium.rentedAt,
        returnedAt: rentedMedium.returnedAt,
      },
    });
    console.log(`Created rented media with id: ${newRentedMedium.id}`);
  }
}
