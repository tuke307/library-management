"use client";
import React, { useState } from "react";
import { Input } from "@heroui/react";
import { getRentedMediaByUserId } from "@/actions/rentedMedia";
import { useFormState } from "react-dom";
import { RentedMediaTableProp } from "@/models/rentedMediaTable";
import { SubmitButton } from "@/app/components/submitButton";

export default function InputForm({
  onFetchSuccess,
}: {
  onFetchSuccess: (data: RentedMediaTableProp[]) => void;
}) {
  const [userId, setUserId] = useState<string>("");
  const [state, formAction] = useFormState<number>(getUserIdState, 0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    formAction();
  };

  async function getUserIdState(): Promise<number> {
    const currentUserId = Number(userId);
    const result = await getRentedMediaByUserId(currentUserId);

    if (Array.isArray(result)) {
      onFetchSuccess(result);
      return result.length;
    } else {
      return 0;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-2">
        <Input
          isRequired
          value={userId}
          label="Kundennumer"
          type="number"
          variant="bordered"
          name="userId"
          placeholder="Kundennummer"
          className="max-w-xs"
          onChange={handleChange}
        />

        <SubmitButton>abrufen</SubmitButton>
      </div>
    </form>
  );
}
