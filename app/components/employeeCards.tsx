"use client";
import React from "react";
import { Card, CardBody, CardFooter, Divider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { BsClipboardCheck, BsPersonPlus, BsPlusLg, BsSearch, BsArrowReturnLeft, BsArrowReturnRight } from "react-icons/bs";

export default function EmployeeCards() {
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
        onPress={() => router.push("/media/create")}
      >
        <CardBody>
          <BsPlusLg className="h-full w-full" />
        </CardBody>
        <Divider />
        <CardFooter>
          <h4 className="text-large font-bold">Medium erstellen</h4>
        </CardFooter>
      </Card>

      <Card
        shadow="sm"
        key="3"
        isPressable
        isHoverable
        className="h-[250px] w-[300px]"
        onPress={() => router.push("/media/inventory")}
      >
        <CardBody>
          <BsClipboardCheck className="h-full w-full" />
        </CardBody>
        <Divider />
        <CardFooter>
          <h4 className="text-large font-bold">Inventur</h4>
        </CardFooter>
      </Card>

      <Card
        shadow="sm"
        key="4"
        isPressable
        isHoverable
        className="h-[250px] w-[300px]"
        onPress={() => router.push("/rentedmedia")}
      >
        <CardBody>
          <BsArrowReturnLeft className="h-full w-full" />
        </CardBody>
        <Divider />
        <CardFooter>
          <h4 className="text-large font-bold">Medium zurückgeben</h4>
        </CardFooter>
      </Card>

      <Card
        shadow="sm"
        key="5"
        isPressable
        isHoverable
        className="h-[250px] w-[300px]"
        onPress={() => router.push("/rentedmedia/create")}
      >
        <CardBody>
          <BsArrowReturnRight className="h-full w-full" />
        </CardBody>
        <Divider />
        <CardFooter>
          <h4 className="text-large font-bold">Medium ausleihen</h4>
        </CardFooter>
      </Card>

      <Card
        shadow="sm"
        key="6"
        isPressable
        isHoverable
        className="h-[250px] w-[300px]"
        onPress={() => router.push("/user/create")}
      >
        <CardBody>
          <BsPersonPlus className="h-full w-full" />
        </CardBody>
        <Divider />
        <CardFooter>
          <h4 className="text-large font-bold">Kunde erstellen</h4>
        </CardFooter>
      </Card>
    </section>
  );
}
