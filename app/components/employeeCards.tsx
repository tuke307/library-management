"use client";
import React from "react";
import { Card, CardContent, CardFooter, Separator } from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  BsClipboardCheck,
  BsPersonPlus,
  BsPlusLg,
  BsSearch,
  BsArrowReturnLeft,
  BsArrowReturnRight,
} from "react-icons/bs";

export default function EmployeeCards() {
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
        onClick={() => router.push("/media/create")}
      >
        <CardContent>
          <BsPlusLg className="h-full w-full" />
        </CardContent>
        <Separator />
        <CardFooter>
          <h4 className="text-large font-bold">Medium erstellen</h4>
        </CardFooter>
      </Card>

      <Card
        key="3"
        className="h-[250px] w-[300px] cursor-pointer shadow-sm transition hover:shadow-md"
        onClick={() => router.push("/media/inventory")}
      >
        <CardContent>
          <BsClipboardCheck className="h-full w-full" />
        </CardContent>
        <Separator />
        <CardFooter>
          <h4 className="text-large font-bold">Inventur</h4>
        </CardFooter>
      </Card>

      <Card
        key="4"
        className="h-[250px] w-[300px] cursor-pointer shadow-sm transition hover:shadow-md"
        onClick={() => router.push("/rentedmedia")}
      >
        <CardContent>
          <BsArrowReturnLeft className="h-full w-full" />
        </CardContent>
        <Separator />
        <CardFooter>
          <h4 className="text-large font-bold">Medium zurückgeben</h4>
        </CardFooter>
      </Card>

      <Card
        key="5"
        className="h-[250px] w-[300px] cursor-pointer shadow-sm transition hover:shadow-md"
        onClick={() => router.push("/rentedmedia/create")}
      >
        <CardContent>
          <BsArrowReturnRight className="h-full w-full" />
        </CardContent>
        <Separator />
        <CardFooter>
          <h4 className="text-large font-bold">Medium ausleihen</h4>
        </CardFooter>
      </Card>

      <Card
        key="6"
        className="h-[250px] w-[300px] cursor-pointer shadow-sm transition hover:shadow-md"
        onClick={() => router.push("/user/create")}
      >
        <CardContent>
          <BsPersonPlus className="h-full w-full" />
        </CardContent>
        <Separator />
        <CardFooter>
          <h4 className="text-large font-bold">Kunde erstellen</h4>
        </CardFooter>
      </Card>
    </section>
  );
}
