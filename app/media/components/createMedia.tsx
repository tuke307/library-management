"use client";
import {
  Textarea,
  Input,
  Spacer,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Select,
  SelectItem,
  Switch,
  Badge,
} from "@heroui/react";
import React from "react";
import { toast } from "react-toastify";
import { MediaDetailProp } from "@/models/mediaDetails";
import { mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";
import {
  BsSave,
  BsX,
  BsTrash,
  BsSearch,
  BsPlusLg,
  BsExclamation,
} from "react-icons/bs";
import { IUpdateMedia, createMedia, deleteMedia, updateMedia } from "@/actions/media";
import { useRouter } from "next/navigation";
import { Author, Location, Media, MediaType, User } from "@prisma/client";
import AuthorModal from "./authorModal";
import { SubmitButton } from "@/app/components/submitButton";
import LocationModal from "./locationModal";

const initialMedia: MediaDetailProp = {
  mediaId: undefined,
  mediaTitle: undefined,
  mediaType: MediaType.BOOK,
  mediaContent: undefined,
  mediaPublished: false,
  mediaISBN: undefined,
  mediaExists: true,
  mediaCreatedAt: undefined,
  mediaUpdatedAt: undefined,

  authorId: undefined,
  authorLastName: undefined,
  authorFirstName: undefined,
  authorEmail: undefined,
  authorBirthday: undefined,

  locationId: undefined,
  locationFloor: undefined,
  locationShelf: undefined,
  locationShelfSection: undefined,

  rentedMediaId: undefined,
  rentedMediaMediaId: undefined,
  rentedMediaUserId: undefined,
  rentedMediaUserLastName: undefined,
  rentedMediaUserFirstName: undefined,
  rentedMediaRentedDate: undefined,
  rentedMediaReturnDate: undefined,
};

export default function CreateMedia({
  authors,
  locations,
  mediaDetails = null,
  editMode = false,
}: {
  authors: Author[] | null;
  locations: Location[] | null;
  mediaDetails?: MediaDetailProp | null;
  editMode?: boolean;
}) {
  const router = useRouter();

  const [formData, setFormData] = React.useState<MediaDetailProp>({
    ...(mediaDetails ?? initialMedia),
  });
  const [showAuthorModal, setShowAuthorModal] = React.useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] =
    React.useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  async function handleSubmit(
    operation: "create" | "update" | "delete" | "discard",
  ) {
    if (operation === "create") {
      if (!formData.mediaTitle || !formData.authorId || !formData.locationId) {
        toast.warning("fehlende Informationen!");
        return;
      }

      const media = await createMedia(
        formData.mediaType,
        formData.mediaTitle,
        formData.mediaPublished,
        formData.mediaContent,
        formData.mediaISBN,
        formData.authorId,
        formData.locationId,
      );

      if (!media) {
        toast.error("Erstellung des Mediums fehlgeschlagen!");
        return;
      } else {
        toast.success("Medium erfolgreich erstellt!");
        router.back();
      }
    } else if (operation === "update") {
      if (
        !formData.mediaId ||
        !formData.mediaTitle ||
        !formData.authorId ||
        !formData.locationId
      ) {
        toast.warning("fehlende Informationen!");
        return;
      }

      const newMedia : IUpdateMedia = {
        id: formData.mediaId,
        type: formData.mediaType,
        title: formData.mediaTitle,
        content: formData.mediaContent,
        published: formData.mediaPublished,
        ISBN: formData.mediaISBN,
        exists: formData.mediaExists,
        authorId: formData.authorId,
        locationId: formData.locationId,
      };

      const media = await updateMedia(newMedia);

      if (!media) {
        toast.error("Speichern fehlgeschlagen!");
        return;
      } else {
        toast.success("Speichern erfolgreich!");
        router.refresh();
      }
    } else if (operation === "delete") {
      if (!formData.mediaId) {
        toast.error("Löschen fehlgeschlagen!");
        return;
      }

      const media = await deleteMedia(formData.mediaId);

      if (!media) {
        toast.error("Löschen fehlgeschlagen!");
        return;
      } else {
        toast.success("Löschen erfolgreich!");
        router.back();
      }
    } else if (operation === "discard") {
      router.back();
    }
  }

  function EditButtons() {
    return (
      <div className="flex justify-start gap-3">
        {!editMode && (
          <SubmitButton
            color="success"
            variant="flat"
            startContent={<BsPlusLg className="m-1" />}
            onPress={() => handleSubmit("create")}
          >
            erstellen
          </SubmitButton>
        )}

        {editMode && (
          <>
            <SubmitButton
              color="success"
              variant="flat"
              startContent={<BsSave />}
              onPress={() => handleSubmit("update")}
            >
              Speichern
            </SubmitButton>

            <SubmitButton
              color="warning"
              variant="flat"
              startContent={<BsX />}
              onPress={() => handleSubmit("discard")}
            >
              Abbrechen
            </SubmitButton>

            <SubmitButton
              color="danger"
              variant="flat"
              startContent={<BsTrash />}
              onPress={() => handleSubmit("delete")}
            >
              Löschen
            </SubmitButton>
          </>
        )}
      </div>
    );
  }

  const setAuthor = (selectedAuthor: Author) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        authorId: selectedAuthor.id,
        authorLastName: selectedAuthor.lastName,
        authorFirstName: selectedAuthor.firstName,
        authorEmail: selectedAuthor.email ?? "",
        authorBirthday: selectedAuthor.birthday ?? new Date(),
      };
    });
  };

  const setLocation = (selectedLocation: Location) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        locationId: selectedLocation.id,
        locationFloor: selectedLocation.floor,
        locationShelf: selectedLocation.shelf,
        locationShelfSection: selectedLocation.shelfSection,
      };
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
      <div className="flex flex-row gap-3">
        <Card shadow="md" className="flex min-w-[50%] flex-grow">
          <CardHeader className="flex gap-3">
            <h1 className="text-3xl">Medium</h1>
          </CardHeader>

          <Divider />

          <CardBody className="flex-col">
            <div className="sr-only" hidden>
              <Input
                isReadOnly
                type="text"
                label="Id"
                name="mediaId"
                variant="bordered"
                onChange={handleChange}
                value={formData.mediaId}
              />
            </div>

            <div>
              <Select
                isRequired={!editMode}
                label="Medientyp"
                name="mediaMediaType"
                selectionMode="single"
                className="max-w"
                items={mediaTypesWithIcons}
                value={formData.mediaType.toString()}
                defaultSelectedKeys={["BOOK"]}
                onChange={handleChange}
              >
                {(mediaType) => (
                  <SelectItem
                    key={mediaType.enum}
                    startContent={mediaType.icon}
                  >
                    {mediaType.label}
                  </SelectItem>
                )}
              </Select>

              <Spacer y={7} />
            </div>

            <Input
              isRequired={!editMode}
              type="text"
              label="Titel"
              name="mediaTitle"
              variant="bordered"
              className="max-w"
              onChange={handleChange}
              value={formData.mediaTitle}
            />

            <Spacer y={2} />

            <Textarea
              type="text"
              label="Inhaltsausschnitt"
              name="mediaContent"
              variant="bordered"
              className="max-w"
              onChange={handleChange}
              value={formData.mediaContent}
            />

            <Spacer y={7} />

            <Input
              type="text"
              label="ISBN"
              name="mediaISBN"
              variant="bordered"
              className="max-w"
              value={formData.mediaISBN}
              onChange={handleChange}
            />

            <div>
              <Spacer y={2} />

              <Switch
                defaultSelected
                name="published"
                color="default"
                value={formData.mediaPublished.toString()}
                onChange={handleChange}
              >
                veröffentlicht
              </Switch>
            </div>
          </CardBody>
        </Card>

        <div className="flex flex-col flex-wrap gap-3">
          <Card shadow="md">
            <CardHeader className="flex justify-between gap-3">
              <h1 className="text-3xl">Author</h1>

              {(!editMode || editMode) && (
                <div className="flex flex-row gap-2">
                  <Badge
                    isOneChar
                    isInvisible={formData.authorId! > 0}
                    content={<BsExclamation />}
                    color="danger"
                    shape="circle"
                    placement="top-right"
                  >
                    <Button
                      isIconOnly
                      onPress={() => setShowAuthorModal(true)}
                      color="primary"
                      id="authorModalBtn"
                    >
                      <BsSearch />
                    </Button>

                    <AuthorModal
                      authorList={authors}
                      show={showAuthorModal}
                      close={() => setShowAuthorModal(false)}
                      setAuthor={setAuthor}
                    />
                  </Badge>
                </div>
              )}
            </CardHeader>

            <Divider />

            <CardBody>
              <div className="flex gap-2">
                <div className="sr-only" hidden>
                  <Input
                    isReadOnly
                    type="number"
                    label="Author-ID"
                    name="authorId"
                    variant="bordered"
                    value={formData.authorId?.toString()}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  isReadOnly
                  isDisabled
                  isRequired={!editMode}
                  type="text"
                  label="Nachname"
                  name="authorLastName"
                  variant="bordered"
                  className="flex-grow"
                  value={formData.authorLastName}
                  onChange={handleChange}
                />
                <Input
                  isReadOnly
                  isDisabled
                  isRequired={!editMode}
                  type="text"
                  label="Vorname"
                  name="authorFirstName"
                  variant="bordered"
                  className="flex-grow"
                  value={formData.authorFirstName}
                  onChange={handleChange}
                />
              </div>

              <Spacer y={5} />

              <Input
                isReadOnly
                isDisabled
                type="email"
                label="Email"
                name="authorEmail"
                variant="bordered"
                className="max-w"
                value={formData.authorEmail}
              />

              <Spacer y={3} />

              <Input
                isReadOnly
                isDisabled
                type="text"
                label="Geburtsdatum"
                name="authorBirthday"
                variant="bordered"
                className="max-w"
                value={formData.authorBirthday?.toLocaleDateString()}
              />
            </CardBody>
          </Card>

          <Card shadow="md">
            <CardHeader className="flex justify-between gap-3">
              <h1 className="text-3xl">Lokation</h1>

              {(!editMode || editMode) && (
                <div>
                  <Badge
                    isOneChar
                    isInvisible={formData.locationId! > 0}
                    content={<BsExclamation />}
                    color="danger"
                    shape="circle"
                    placement="top-right"
                  >
                    <Button
                      isIconOnly
                      color="primary"
                      id="locationModalBtn"
                      onPress={() => setShowLocationModal(true)}
                    >
                      <BsSearch />
                    </Button>

                    <LocationModal
                      freeLocations={locations}
                      show={showLocationModal}
                      close={() => setShowLocationModal(false)}
                      setLocation={setLocation}
                    />
                  </Badge>
                </div>
              )}
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex gap-2">
                <div className="sr-only" hidden>
                  <Input
                    isReadOnly
                    name="locationId"
                    type="number"
                    label="Id"
                    variant="bordered"
                    value={formData.locationId?.toString()}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  isReadOnly
                  isDisabled
                  isRequired={!editMode}
                  type="text"
                  label="Etage"
                  name="locationFloor"
                  variant="bordered"
                  className="grow"
                  value={formData.locationFloor?.toString()}
                  onChange={handleChange}
                />
                <Input
                  isReadOnly
                  isDisabled
                  isRequired={!editMode}
                  type="text"
                  label="Regal"
                  name="locationShelf"
                  variant="bordered"
                  className="grow"
                  value={formData.locationShelf?.toString()}
                  onChange={handleChange}
                />
                <Input
                  isReadOnly
                  isDisabled
                  isRequired={!editMode}
                  type="text"
                  name="locationShelfSection"
                  label="Regalabschnitt"
                  variant="bordered"
                  className="grow"
                  value={formData.locationShelfSection?.toString()}
                  onChange={handleChange}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <EditButtons />
    </form>
  );
}
