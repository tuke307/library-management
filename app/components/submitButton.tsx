"use client";
import { Button, ButtonProps } from "@heroui/react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit" className="mt-3" color="primary" {...props} />
  );
}