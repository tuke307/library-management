"use client";
import React from "react";
import { Card, CardContent, CardFooter, Separator } from "@heroui/react";
import { useRouter } from "next/navigation";
import { BsSearch, BsBookshelf } from "react-icons/bs";

export default function UserCards() {
  const router = useRouter();

  return (
    <section className="flex flex-row flex-wrap items-center justify-center gap-4 py-8 md:py-10">
      <Card
        key="1"
        className="h-[250px] w-[300px] cursor-pointer shadow-sm transition hover:shadow-md"
        onClick={() => router.push("/media/search")}
      >
        <CardContent>
          <BsSearch className="h-full w-full" />
        </CardContent>
        <Separator />
        <CardFooter>
          <h4 className="text-large font-bold">Medium suchen</h4>
        </CardFooter>
      </Card>

      <Card
        key="2"
        className="h-[250px] w-[300px] cursor-pointer shadow-sm transition hover:shadow-md"
        onClick={() => router.push("/rentedmedia")}
      >
        <CardContent>
          <BsBookshelf className="h-full w-full" />
        </CardContent>
        <Separator />
        <CardFooter>
          <h4 className="text-large font-bold">ausgeliehene Medien anzeigen</h4>
        </CardFooter>
      </Card>
    </section>
  );
}
