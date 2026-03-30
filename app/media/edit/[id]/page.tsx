import React from "react";
import { getMediaDetails } from "@/actions/media";
import CreateMedia from "../../components/createMedia";
import getAllAuthors from "@/actions/authors";
import getAllFreeLocations from "@/actions/location";

export default async function MediaEditPage({
  params,
}: {
  params: { id: string };
}) {
  const mediaDetails = await getMediaDetails(params.id);
  const authorList = await getAllAuthors();
  const freeLocationList = await getAllFreeLocations();

  return (
    <section className="m-10">
      <CreateMedia
        authors={authorList}
        locations={freeLocationList}
        mediaDetails={mediaDetails}
        editMode
      />
    </section>
  );
}
