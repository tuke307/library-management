"use client";
import {
  TextArea,
  Input,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Separator,
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
        <Card className="flex min-w-[50%] flex-grow shadow-md">
          <CardHeader className="flex gap-3">
            <h1 className="text-3xl">Medium</h1>

            <div className="flex flex-grow items-center gap-2">
              <Chip>
                <span className="mr-2 inline-flex">{mediaType?.icon}</span>
                {mediaType?.label}
              </Chip>
              <Chip
                color={mediaDetails?.mediaPublished ? "success" : "warning"}
              >
                {mediaDetails?.mediaPublished
                  ? "veröffentlicht"
                  : "unveröffentlicht"}
              </Chip>

              <Chip
                variant="secondary"
                color={isRented ? "warning" : "success"}
              >
                {isRented ? "ausgeliehen" : "verfügbar"}
              </Chip>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="flex-col">
            <div className="sr-only" hidden>
              <Input
                readOnly
                disabled
                type="text"
                name="mediaId"
                onChange={handleChange}
                value={formData.mediaId}
              />
            </div>

            <Input
              readOnly
              disabled
              type="text"
              name="mediaTitle"
              className="max-w"
              onChange={handleChange}
              value={formData.mediaTitle}
            />

            <div className="h-2" />

            <TextArea
              readOnly
              disabled
              name="mediaContent"
              className="max-w"
              onChange={handleChange}
              value={formData.mediaContent}
            />

            <div className="h-7" />

            <Input
              readOnly
              disabled
              type="text"
              name="mediaISBN"
              className="max-w"
              value={formData.mediaISBN}
              onChange={handleChange}
            />

            <div className="h-2" />

            <div className="flex gap-2">
              <Input
                readOnly
                disabled
                type="text"
                name="mediaCreatedAt"
                className="max-w"
                value={formData.mediaCreatedAt?.toLocaleDateString()}
              />
              <Input
                readOnly
                disabled
                type="text"
                name="mediaUpdatedAt"
                className="max-w"
                value={formData.mediaUpdatedAt?.toLocaleDateString()}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col flex-wrap gap-3">
          <Card className="shadow-md">
            <CardHeader className="flex justify-between gap-3">
              <h1 className="text-3xl">Author</h1>
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
                  type="text"
                  name="authorLastName"
                  className="flex-grow"
                  value={formData.authorLastName}
                  onChange={handleChange}
                />
                <Input
                  readOnly
                  disabled
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
                  type="text"
                  name="locationFloor"
                  className="grow"
                  value={formData.locationFloor?.toString()}
                  onChange={handleChange}
                />
                <Input
                  readOnly
                  disabled
                  type="text"
                  name="locationShelf"
                  className="grow"
                  value={formData.locationShelf?.toString()}
                  onChange={handleChange}
                />
                <Input
                  readOnly
                  disabled
                  type="text"
                  name="locationShelfSection"
                  className="grow"
                  value={formData.locationShelfSection?.toString()}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {session && isRented && (
            <Card className="shadow-md">
              <CardHeader className="flex justify-between gap-3">
                <h1 className="text-3xl">Ausleihe</h1>
              </CardHeader>

              <div>
                <Separator />
                <CardContent className="flex flex-row gap-2">
                  <div className="sr-only" hidden>
                    <Input
                      readOnly
                      type="text"
                      name="rentedMediaId"
                      className="max-w"
                      value={formData.rentedMediaId!.toString()}
                    />
                  </div>
                  <Input
                    readOnly
                    disabled
                    type="text"
                    name="rentedMediaUserId"
                    className="max-w"
                    value={
                      formData.rentedMediaUserId === 0
                        ? ""
                        : formData.rentedMediaUserId!.toString()
                    }
                  />
                  <Input
                    readOnly
                    disabled
                    type="text"
                    name="rentedMediaUserLastName"
                    className="max-w"
                    value={formData.rentedMediaUserLastName!.toString()}
                  />
                  <Input
                    readOnly
                    disabled
                    type="text"
                    name="rentedMediaUserFirstName"
                    className="max-w"
                    value={formData.rentedMediaUserFirstName!.toString()}
                  />
                </CardContent>
              </div>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
