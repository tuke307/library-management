"use client";
import {
  Link,
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Button,
  Spinner,
} from "@heroui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { BsHouse } from "react-icons/bs";

export function Navbar() {
  const { data: session, status } = useSession();

  const AuthButton = React.useMemo(() => {
    if (status === "loading") {
      return <Spinner color="primary" />;
    } else {
      if (session) {
        return (
          <>
            <Button onClick={() => signOut()} color="primary">
              Logout
            </Button>
          </>
        );
      }
      return (
        <>
          <Button onClick={() => signIn()} color="primary">
            Mitarbeiterlogin
          </Button>
        </>
      );
    }
  }, [session, status]);

  return (
    <HeroUINavbar isBordered maxWidth="full">
      <NavbarBrand>
        <Link className="flex items-center justify-start gap-3" href="/">
          <BsHouse />
          <p className="font-bold text-inherit">Home</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>{AuthButton}</NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
}
