"use client";
import React from "react";
import { Card, CardContent, CardHeader, Separator, Input } from "@heroui/react";
import { ICreateUser, createUser } from "@/actions/user";
import { SubmitButton } from "@/app/components/submitButton";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BsPersonPlus } from "react-icons/bs";

const initialState: ICreateUser = {
  lastName: "",
  firstName: "",
  email: "",
  street: "",
  houseNumber: "",
  plz: 0,
  city: "",
};

export default function AddUserForm() {
  const router = useRouter();
  const [formData, setFormData] = React.useState(initialState);

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = await createUser(formData);

    if (!user) {
      toast.error("Nutzer konnte nicht erstellt werden");
      return;
    } else {
      router.back();
      toast.success("Nutzer erfolgreich erstellt");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-md">
        <CardHeader className="flex gap-3">
          <h1 className="text-3xl">Nutzer hinzufügen</h1>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Input
              required
              type="text"
              name="lastName"
              placeholder="Mustermann"
              value={formData.lastName}
              onChange={handleChange}
            />
            <Input
              required
              type="text"
              name="firstName"
              placeholder="Max"
              value={formData.firstName}
              onChange={handleChange}
            />

            <Input
              required
              type="email"
              name="email"
              placeholder="mustermann.max@gmail.com"
              value={formData.email!}
              onChange={handleChange}
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2">
            <Input
              required
              type="text"
              name="street"
              placeholder="Musterstraße"
              value={formData.street}
              onChange={handleChange}
            />

            <Input
              required
              type="text"
              name="houseNumber"
              placeholder="1a"
              value={formData.houseNumber}
              onChange={handleChange}
            />

            <Input
              required
              type="number"
              name="plz"
              placeholder="12345"
              value={formData.plz === 0 ? "" : formData.plz.toString()}
              onChange={handleChange}
            />

            <Input
              required
              type="text"
              name="city"
              placeholder="Musterstadt"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      <SubmitButton>
        <span className="mr-2 inline-flex">
          <BsPersonPlus className="m-1" />
        </span>
        Kunde erstellen
      </SubmitButton>
    </form>
  );
}
