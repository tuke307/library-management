"use client";
import {
  Textarea,
  Input,
  Chip,
  Spacer,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import React from "react";
import { MediaDetailProp } from "@/models/mediaDetails";
import { mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";
import { useSession } from "next-auth/react";

export default function ViewDetails({
  mediaDetails,
}: {
  mediaDetails: MediaDetailProp;
}) {
  const { data: session } = useSession();

  const [isRented, setRented] = React.useState(false);

  const [formData, setFormData] = React.useState<MediaDetailProp>({
    ...mediaDetails,
  });

  React.useEffect(() => {
    mediaDetails?.rentedMediaId ? setRented(true) : setRented(false);
  }, [mediaDetails]);

  const mediaType = React.useMemo(() => {
    return mediaDetails
      ? mediaTypesWithIcons.find(
          (mediaType) => mediaType.enum === mediaDetails.mediaType,
        )
      : undefined;
  }, [mediaDetails]);

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  return (
    <form className="flex flex-col gap-3">
      <div className="flex flex-row gap-3">
        <Card shadow="md" className="flex min-w-[50%] flex-grow">
          <CardHeader className="flex gap-3">
            <h1 className="text-3xl">Medium</h1>

            <div className="flex flex-grow items-center gap-2">
              <Chip
                startContent={mediaType?.icon}
                variant="flat"
                color="default"
              >
                {mediaType?.label}
              </Chip>
              <Chip
                variant="flat"
                color={mediaDetails?.mediaPublished ? "success" : "warning"}
              >
                {mediaDetails?.mediaPublished
                  ? "veröffentlicht"
                  : "unveröffentlicht"}
              </Chip>

              <Chip variant="flat" color={isRented ? "warning" : "success"}>
                {isRented ? "ausgeliehen" : "verfügbar"}
              </Chip>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="flex-col">
            <div className="sr-only" hidden>
              <Input
                isReadOnly
                isDisabled
                type="text"
                label="Id"
                name="mediaId"
                variant="bordered"
                onChange={handleChange}
                value={formData.mediaId}
              />
            </div>

            <Input
              isReadOnly
              isDisabled
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
              isReadOnly
              isDisabled
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
              isReadOnly
              isDisabled
              type="text"
              label="ISBN"
              name="mediaISBN"
              variant="bordered"
              className="max-w"
              value={formData.mediaISBN}
              onChange={handleChange}
            />

            <Spacer y={2} />

            <div className="flex gap-2">
              <Input
                isReadOnly
                isDisabled
                type="text"
                label="hinzugefügt am"
                name="mediaCreatedAt"
                variant="bordered"
                className="max-w"
                value={formData.mediaCreatedAt?.toLocaleDateString()}
              />
              <Input
                isReadOnly
                isDisabled
                type="text"
                label="letztes Update"
                name="mediaUpdatedAt"
                variant="bordered"
                className="max-w"
                value={formData.mediaUpdatedAt?.toLocaleDateString()}
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex flex-col flex-wrap gap-3">
          <Card shadow="md">
            <CardHeader className="flex justify-between gap-3">
              <h1 className="text-3xl">Author</h1>
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

          {session && isRented && (
            <Card shadow="md">
              <CardHeader className="flex justify-between gap-3">
                <h1 className="text-3xl">Ausleihe</h1>
              </CardHeader>

              <div>
                <Divider />
                <CardBody className="flex flex-row gap-2">
                  <div className="sr-only" hidden>
                    <Input
                      isReadOnly
                      type="text"
                      label="ID"
                      name="rentedMediaId"
                      variant="bordered"
                      className="max-w"
                      value={formData.rentedMediaId!.toString()}
                    />
                  </div>
                  <Input
                    isReadOnly
                    isDisabled
                    type="text"
                    label="Kunden-ID"
                    name="rentedMediaUserId"
                    variant="bordered"
                    className="max-w"
                    value={
                      formData.rentedMediaUserId === 0
                        ? ""
                        : formData.rentedMediaUserId!.toString()
                    }
                  />
                  <Input
                    isReadOnly
                    isDisabled
                    type="text"
                    label="Nachname"
                    name="rentedMediaUserLastName"
                    variant="bordered"
                    className="max-w"
                    value={formData.rentedMediaUserLastName!.toString()}
                  />
                  <Input
                    isReadOnly
                    isDisabled
                    type="text"
                    label="Nachname"
                    name="rentedMediaUserFirstName"
                    variant="bordered"
                    className="max-w"
                    value={formData.rentedMediaUserFirstName!.toString()}
                  />
                </CardBody>
              </div>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
