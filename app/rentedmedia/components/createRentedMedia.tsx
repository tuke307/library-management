"use client";
import {
  Input,
  Button,
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableCell,
  getKeyValue,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { Media, User } from "@prisma/client";
import React from "react";
import UserModal from "./userModal";
import { BsSearch, BsPlusLg, BsArrowReturnRight, BsXLg } from "react-icons/bs";
import MediaModal from "./mediaModal";
import { MediaTableProp } from "@/models/mediaTable";
import { createRentedMedia } from "@/actions/rentedMedia";
import { toast } from "react-toastify";
import { mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";

export default function CreateRentedMedia({
  users,
  medias,
}: {
  users: User[] | null;
  medias: MediaTableProp[] | null;
}) {
  const [showMediaModal, setShowMediaModal] = React.useState<boolean>(false);
  const [showUserModal, setShowUserModal] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState("");
  const [mediaList, setMediaList] = React.useState<MediaTableProp[]>([]);

  const setUser = (selectedUser: User) => {
    setUserId(selectedUser.id.toString());
  };

  const setMedia = (selectedMedia: MediaTableProp) => {
    if (!mediaList.some((media) => media.id === selectedMedia.id)) {
      setMediaList((prevMediaList) => [...prevMediaList, selectedMedia]);
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-row gap-2">
        <Input
          isRequired
          isDisabled
          isReadOnly
          value={userId}
          label="Kundennummer"
          type="number"
          variant="bordered"
          name="userId"
          placeholder="Kundennummer"
          className="max-w-xs"
        />

        <div className="flex flex-row items-center gap-2">
          <Button
            isIconOnly
            size="lg"
            onPress={() => setShowUserModal(true)}
            color="primary"
          >
            <BsSearch />
          </Button>

          <UserModal
            userList={users}
            show={showUserModal}
            close={() => setShowUserModal(false)}
            setUser={setUser}
          />
        </div>
      </div>
    );
  }, [userId, users, showUserModal, setShowUserModal]);

  const bottomContent = React.useMemo(() => {
    const handleRent = async () => {
      if (!userId) {
        toast.warning("Keine Kundennummer ausgewählt");
        return;
      } else if (mediaList.length === 0) {
        toast.warning("Keine Medien ausgewählt");
        return;
      }

      const rentedMedias = await createRentedMedia(
        Number(userId),
        mediaList.map((item) => item.id),
      );

      if (rentedMedias) {
        toast.success("Medien erfolgreich ausgeliehen");
        setUserId("");
        setMediaList([]);
      } else {
        toast.error("Fehler beim Ausleihen");
      }
    };

    return (
      <div className="flex flex-row gap-2">
        <div className="flex flex-grow flex-row gap-2">
          <Button
            color="primary"
            variant="flat"
            startContent={<BsPlusLg />}
            onPress={() => setShowMediaModal(true)}
          >
            Medium hinzufügen
          </Button>

          <MediaModal
            mediaList={medias}
            show={showMediaModal}
            close={() => setShowMediaModal(false)}
            setMedia={setMedia}
          />
        </div>

        <Button
          className="justify-end"
          color="success"
          variant="solid"
          startContent={<BsArrowReturnRight />}
          onPress={handleRent}
        >
          ausleihen
        </Button>
      </div>
    );
  }, [medias, userId, showMediaModal, setShowMediaModal]);

  return (
    <section className="m-3 flex flex-col gap-5">
      <Table
        aria-label="Media Table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader>
          <TableColumn key="type" className="w-10">
            Typ
          </TableColumn>
          <TableColumn key="title" allowsSorting>
            Titel
          </TableColumn>
          <TableColumn key="authorName" allowsSorting>
            Author
          </TableColumn>
          <TableColumn key="location" allowsSorting>
            Ort
          </TableColumn>
          <TableColumn key="actions">Aktion</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Keine Medien ausgewählt"}>
          {mediaList.map((item) => {
            const mediaTypeWithIcon = mediaTypesWithIcons.find(
              (icon) => icon.enum === getKeyValue(item, "type"),
            );

            return (
              <TableRow key={item.id}>
                <TableCell>
                  {mediaTypeWithIcon ? mediaTypeWithIcon.icon : ""}
                </TableCell>
                <TableCell>{getKeyValue(item, "title")}</TableCell>
                <TableCell>{getKeyValue(item, "authorName")}</TableCell>
                <TableCell>{getKeyValue(item, "locationName")}</TableCell>
                <TableCell>
                  <Tooltip content="Medium editieren">
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => {
                        setMediaList((prevMediaList) =>
                          prevMediaList.filter((media) => media.id !== item.id),
                        );
                      }}
                    >
                      <BsXLg />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
