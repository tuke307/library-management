"use client";
import React from "react";
import { getMediaTable } from "@/actions/media";
import ButtonComponent from "./components/ButtonComponent";
import { MediaTableProp } from "@/models/mediaTable";
import MediaTable from "../components/mediaTable";

export default function InventoryPage() {
  const [mediaTableProps, setMediaTableProps] = React.useState<
    MediaTableProp[] | null
  >(null);
  const [update, setUpdate] = React.useState(false);

  const updateMediaTableProps = async () => {
    const newProps = await getMediaTable();
    setMediaTableProps(newProps);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const props = await getMediaTable();
      setMediaTableProps(props);
    };

    fetchData();
  }, [update]);

  const handleButtonClick = () => {
    setUpdate((prevState) => !prevState);
  };

  return (
    <section className="m-3 flex flex-col gap-3">
      <MediaTable
        mediaTableProps={mediaTableProps}
        updateMediaTableProps={updateMediaTableProps}
      />
      <ButtonComponent onButtonClick={handleButtonClick} />
    </section>
  );
}
