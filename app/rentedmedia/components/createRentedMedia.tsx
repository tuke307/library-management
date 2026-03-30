"use client";
import { Input, Button, Table } from "@heroui/react";
import type { Media, User } from "@/client";
import React from "react";
import UserModal from "./userModal";
import { BsSearch, BsPlusLg, BsArrowReturnRight, BsXLg } from "react-icons/bs";
import MediaModal from "./mediaModal";
import { MediaTableProp } from "@/models/mediaTable";
import { createRentedMedia } from "@/actions/rentedMedia";
import { toast } from "react-toastify";
import { mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";

const getKeyValue = <T, K extends keyof T>(item: T, key: K): T[K] => item[key];

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
          required
          disabled
          readOnly
          value={userId}
          type="number"
          name="userId"
          placeholder="Kundennummer"
          className="max-w-xs"
        />

        <div className="flex flex-row items-center gap-2">
          <Button isIconOnly size="lg" onPress={() => setShowUserModal(true)}>
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
          <Button onPress={() => setShowMediaModal(true)}>
            <span className="mr-2 inline-flex">
              <BsPlusLg />
            </span>
            Medium hinzufügen
          </Button>

          <MediaModal
            mediaList={medias}
            show={showMediaModal}
            close={() => setShowMediaModal(false)}
            setMedia={setMedia}
          />
        </div>

        <Button className="justify-end" onPress={handleRent}>
          <span className="mr-2 inline-flex">
            <BsArrowReturnRight />
          </span>
          ausleihen
        </Button>
      </div>
    );
  }, [medias, userId, showMediaModal, setShowMediaModal]);

  return (
    <section className="m-3 flex flex-col gap-5">
      {topContent}
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Media Table">
            <Table.Header>
              <Table.Column key="type" className="w-10" isRowHeader>
                Typ
              </Table.Column>
              <Table.Column key="title" allowsSorting>
                Titel
              </Table.Column>
              <Table.Column key="authorName" allowsSorting>
                Author
              </Table.Column>
              <Table.Column key="location" allowsSorting>
                Ort
              </Table.Column>
              <Table.Column key="actions">Aktion</Table.Column>
            </Table.Header>
            <Table.Body items={mediaList}>
              {(item: MediaTableProp) => {
                const mediaTypeWithIcon = mediaTypesWithIcons.find(
                  (icon) => icon.enum === getKeyValue(item, "type"),
                );

                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      {mediaTypeWithIcon ? mediaTypeWithIcon.icon : ""}
                    </Table.Cell>
                    <Table.Cell>{getKeyValue(item, "title")}</Table.Cell>
                    <Table.Cell>{getKeyValue(item, "authorName")}</Table.Cell>
                    <Table.Cell>{getKeyValue(item, "locationName")}</Table.Cell>
                    <Table.Cell>
                      <Button
                        isIconOnly
                        onPress={() => {
                          setMediaList((prevMediaList) =>
                            prevMediaList.filter(
                              (media) => media.id !== item.id,
                            ),
                          );
                        }}
                      >
                        <BsXLg />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      {bottomContent}
    </section>
  );
}
