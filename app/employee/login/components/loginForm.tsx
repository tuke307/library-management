"use client";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Separator,
  Input,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SubmitButton } from "@/app/components/submitButton";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  function handleChange(event: React.ChangeEvent<any>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const res = await signIn("credentials", {
      id: formData.id,
      password: formData.password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/");
    } else if (res?.status === 401) {
      toast.error(
        "Die angegebene Mitarbeiternummer oder das Passwort ist ungültig.",
      );
      formData.password = "";
    } else {
      toast.error(
        "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut",
      );

      formData.id = "";
      formData.password = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-[200px] min-w-[300px]">
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold">Login</h2>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-3">
          <Input
            required
            onChange={handleChange}
            value={formData.id}
            type="number"
            name="id"
            placeholder="Gib deine Mitarbeiternummer ein"
            className="flex-grow"
          />

          <Input
            required
            onChange={handleChange}
            value={formData.password}
            name="password"
            placeholder="Gib dein Passwort ein"
            type="password"
            className="flex-grow"
          />
        </CardContent>

        <Separator />

        <CardFooter>
          <SubmitButton>Login</SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
