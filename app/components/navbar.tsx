"use client";
import { Link, Button, Spinner } from "@heroui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { BsHouse } from "react-icons/bs";

export function Navbar() {
  const { data: session, status } = useSession();

  const AuthButton = React.useMemo(() => {
    if (status === "loading") {
      return <Spinner color="accent" />;
    } else {
      if (session) {
        return (
          <>
            <Button onClick={() => signOut()} variant="primary">
              Logout
            </Button>
          </>
        );
      }
      return (
        <>
          <Button onClick={() => signIn()} variant="primary">
            Mitarbeiterlogin
          </Button>
        </>
      );
    }
  }, [session, status]);

  return (
    <nav className="border-default-200 bg-background/70 sticky top-0 z-40 w-full border-b backdrop-blur-lg">
      <header className="mx-auto flex h-16 w-full items-center justify-between px-4">
        <Link className="flex items-center justify-start gap-3" href="/">
          <BsHouse />
          <p className="font-bold text-inherit">Home</p>
        </Link>

        <div>{AuthButton}</div>
      </header>
    </nav>
  );
}
