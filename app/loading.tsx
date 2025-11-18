"use client";
import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Spinner color="primary" />
    </div>
  );
}
