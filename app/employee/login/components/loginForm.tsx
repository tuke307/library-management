"use client";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SubmitButton } from "@/app/components/submitButton";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
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
        <Divider />
        <CardBody className="flex flex-col gap-3">
          <Input
            isRequired
            onChange={handleChange}
            value={formData.id}
            label="Mitarbeiternummer"
            type="number"
            variant="bordered"
            name="id"
            labelPlacement="outside"
            placeholder="Gib deine Mitarbeiternummer ein"
            className="flex-grow"
          />

          <Input
            isRequired
            onChange={handleChange}
            value={formData.password}
            label="Passwort"
            variant="bordered"
            name="password"
            placeholder="Gib dein Passwort ein"
            labelPlacement="outside"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <BsFillEyeSlashFill className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <BsFillEyeFill className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="flex-grow"
          />
        </CardBody>
        
        <Divider />

        <CardFooter>
          <SubmitButton>Login</SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
