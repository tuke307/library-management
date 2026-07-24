"use client";
import {
  TextArea,
  Input,
  Card,
  CardContent,
  CardHeader,
  Separator,
  Button,
  Switch,
} from "@heroui/react";
import React from "react";
import { toast } from "react-toastify";
import { MediaDetailProp } from "@/models/mediaDetails";
import { MEDIA_TYPE, mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";
import { BsSave, BsX, BsTrash, BsSearch, BsPlusLg } from "react-icons/bs";
import {
  IUpdateMedia,
  createMedia,
  deleteMedia,
  updateMedia,
} from "@/actions/media";
import { useRouter } from "next/navigation";
import type { Author, Location, Media, MediaType, User } from "@/client";
import AuthorModal from "./authorModal";
import { SubmitButton } from "@/app/components/submitButton";
import LocationModal from "./locationModal";

const initialMedia: MediaDetailProp = {
  mediaId: undefined,
  mediaTitle: undefined,
  mediaType: MEDIA_TYPE.BOOK,
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

      const newMedia: IUpdateMedia = {
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
          <SubmitButton onPress={() => handleSubmit("create")}>
            <span className="mr-2 inline-flex">
              <BsPlusLg className="m-1" />
            </span>
            erstellen
          </SubmitButton>
        )}

        {editMode && (
          <>
            <SubmitButton onPress={() => handleSubmit("update")}>
              <span className="mr-2 inline-flex">
                <BsSave />
              </span>
              Speichern
            </SubmitButton>

            <SubmitButton onPress={() => handleSubmit("discard")}>
              <span className="mr-2 inline-flex">
                <BsX />
              </span>
              Abbrechen
            </SubmitButton>

            <SubmitButton onPress={() => handleSubmit("delete")}>
              <span className="mr-2 inline-flex">
                <BsTrash />
              </span>
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
        <Card className="flex min-w-[50%] flex-grow shadow-md">
          <CardHeader className="flex gap-3">
            <h1 className="text-3xl">Medium</h1>
          </CardHeader>

          <Separator />

          <CardContent className="flex-col">
            <div className="sr-only" hidden>
              <Input
                readOnly
                type="text"
                name="mediaId"
                onChange={handleChange}
                value={formData.mediaId}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm" htmlFor="mediaType">
                Medientyp
              </label>
              <select
                id="mediaType"
                required={!editMode}
                name="mediaType"
                className="rounded-medium border-default-200 w-full border bg-transparent px-3 py-2"
                value={formData.mediaType.toString()}
                onChange={handleChange}
              >
                {mediaTypesWithIcons.map((mediaType) => (
                  <option key={mediaType.enum} value={mediaType.enum}>
                    {mediaType.label}
                  </option>
                ))}
              </select>

              <div className="h-7" />
            </div>

            <Input
              required={!editMode}
              type="text"
              name="mediaTitle"
              className="max-w"
              onChange={handleChange}
              value={formData.mediaTitle}
            />

            <div className="h-2" />

            <TextArea
              name="mediaContent"
              className="max-w"
              onChange={handleChange}
              value={formData.mediaContent}
            />

            <div className="h-7" />

            <Input
              type="text"
              name="mediaISBN"
              className="max-w"
              value={formData.mediaISBN}
              onChange={handleChange}
            />

            <div>
              <div className="h-2" />

              <Switch
                defaultSelected
                name="published"
                isSelected={Boolean(formData.mediaPublished)}
                onChange={(isSelected) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    mediaPublished: isSelected,
                  }))
                }
              >
                veröffentlicht
              </Switch>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col flex-wrap gap-3">
          <Card className="shadow-md">
            <CardHeader className="flex justify-between gap-3">
              <h1 className="text-3xl">Author</h1>

              {(!editMode || editMode) && (
                <div className="flex flex-row gap-2">
                  <Button
                    isIconOnly
                    onPress={() => setShowAuthorModal(true)}
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
                </div>
              )}
            </CardHeader>

            <Separator />

            <CardContent>
              <div className="flex gap-2">
                <div className="sr-only" hidden>
                  <Input
                    readOnly
                    type="number"
                    name="authorId"
                    value={formData.authorId?.toString()}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  readOnly
                  disabled
                  required={!editMode}
                  type="text"
                  name="authorLastName"
                  className="flex-grow"
                  value={formData.authorLastName}
                  onChange={handleChange}
                />
                <Input
                  readOnly
                  disabled
                  required={!editMode}
                  type="text"
                  name="authorFirstName"
                  className="flex-grow"
                  value={formData.authorFirstName}
                  onChange={handleChange}
                />
              </div>

              <div className="h-5" />

              <Input
                readOnly
                disabled
                type="email"
                name="authorEmail"
                className="max-w"
                value={formData.authorEmail}
              />

              <div className="h-3" />

              <Input
                readOnly
                disabled
                type="text"
                name="authorBirthday"
                className="max-w"
                value={formData.authorBirthday?.toLocaleDateString()}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex justify-between gap-3">
              <h1 className="text-3xl">Lokation</h1>

              {(!editMode || editMode) && (
                <div>
                  <Button
                    isIconOnly
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
                </div>
              )}
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="flex gap-2">
                <div className="sr-only" hidden>
                  <Input
                    readOnly
                    name="locationId"
                    type="number"
                    value={formData.locationId?.toString()}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  readOnly
                  disabled
                  required={!editMode}
                  type="text"
                  name="locationFloor"
                  className="grow"
                  value={formData.locationFloor?.toString()}
                  onChange={handleChange}
                />
                <Input
                  readOnly
                  disabled
                  required={!editMode}
                  type="text"
                  name="locationShelf"
                  className="grow"
                  value={formData.locationShelf?.toString()}
                  onChange={handleChange}
                />
                <Input
                  readOnly
                  disabled
                  required={!editMode}
                  type="text"
                  name="locationShelfSection"
                  className="grow"
                  value={formData.locationShelfSection?.toString()}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditButtons />
    </form>
  );
}
