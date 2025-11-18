"use client";
import React from "react";
import { Card, CardBody, CardFooter, Divider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { BsSearch, BsBookshelf } from "react-icons/bs";

export default function UserCards() {
  const router = useRouter();

  return (
    <section className="flex flex-row flex-wrap items-center justify-center gap-4 py-8 md:py-10">
      <Card
        shadow="sm"
        key="1"
        isPressable
        isHoverable
        className="h-[250px] w-[300px]"
        onPress={() => router.push("/media/search")}
      >
        <CardBody>
          <BsSearch className="h-full w-full" />
        </CardBody>
        <Divider />
        <CardFooter>
          <h4 className="text-large font-bold">Medium suchen</h4>
        </CardFooter>
      </Card>

      <Card
        shadow="sm"
        key="2"
        isPressable
        isHoverable
        className="h-[250px] w-[300px]"
        onPress={() => router.push("/rentedmedia")}
      >
        <CardBody>
          <BsBookshelf className="h-full w-full" />
        </CardBody>
        <Divider />
        <CardFooter>
          <h4 className="text-large font-bold">ausgeliehene Medien anzeigen</h4>
        </CardFooter>
      </Card>
    </section>
  );
}
