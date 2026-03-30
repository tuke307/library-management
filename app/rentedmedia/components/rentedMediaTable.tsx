"use client";
import { Table, Button, SortDescriptor } from "@heroui/react";
import React from "react";
import { RentedMediaTableProp } from "@/models/rentedMediaTable";
import { updateRentedMediaById } from "@/actions/rentedMedia";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";

const getKeyValue = <T, K extends keyof T>(item: T, key: K): T[K] => item[key];

export default function RentedMediaTable({
  rentedMediaTableProps,
}: {
  rentedMediaTableProps: RentedMediaTableProp[] | null;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEmployee, setEmployee] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "returnedAt",
    direction: "descending",
  });

  React.useEffect(() => {
    if (session) setEmployee(true);
  });

  const medias = rentedMediaTableProps;
  const rowsPerPage = 10;

  const pages = Math.ceil((medias?.length ?? 0) / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return medias?.slice(start, end) ?? [];
  }, [page, medias, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first =
        a[sortDescriptor.column as keyof RentedMediaTableProp] ?? "";
      const second =
        b[sortDescriptor.column as keyof RentedMediaTableProp] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onPress={() => setPage((prev) => Math.max(1, prev - 1))}
            isDisabled={page <= 1}
          >
            Zurueck
          </Button>
          <span className="text-sm">
            Seite {page} / {Math.max(1, pages)}
          </span>
          <Button
            variant="ghost"
            onPress={() =>
              setPage((prev) => Math.min(Math.max(1, pages), prev + 1))
            }
            isDisabled={page >= Math.max(1, pages)}
          >
            Weiter
          </Button>
        </div>
      </div>
    );
  }, [items.length, page, pages]);

  async function updateRentedMedia(id: number) {
    const rentedMedia = await updateRentedMediaById(id);

    if (!rentedMedia) {
      toast.error("Fehler beim Zurückgeben des Mediums");
      return;
    } else {
      router.refresh();
      toast.success("Medium erfolgreich zurückgegeben");
    }
  }

  return (
    <section>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="return media table">
            <Table.Header>
              <Table.Column key="mediaType" isRowHeader>Typ</Table.Column>
              <Table.Column key="mediaTitle" allowsSorting>
                Titel
              </Table.Column>
              <Table.Column key="mediaId" allowsSorting>
                Media ID
              </Table.Column>
              <Table.Column key="rentedAt" allowsSorting>
                Ausgeliehen am
              </Table.Column>
              <Table.Column key="returnedAt" allowsSorting>
                Zurückgegeben am
              </Table.Column>
              {isEmployee && <Table.Column key="action">Aktion</Table.Column>}
            </Table.Header>
            <Table.Body items={sortedItems}>
              {(item: RentedMediaTableProp) => {
                const mediaTypeWithIcon = mediaTypesWithIcons.find(
                  (icon) => icon.enum === getKeyValue(item, "mediaType"),
                );

                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      {mediaTypeWithIcon ? mediaTypeWithIcon.icon : ""}
                    </Table.Cell>
                    <Table.Cell>{getKeyValue(item, "mediaTitle")}</Table.Cell>
                    <Table.Cell>{getKeyValue(item, "mediaId")}</Table.Cell>
                    <Table.Cell>
                      {getKeyValue(item, "rentedAt").toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {(() => {
                        const returnedAt = getKeyValue(item, "returnedAt");
                        return returnedAt
                          ? returnedAt.toLocaleDateString()
                          : "-";
                      })()}
                    </Table.Cell>
                    {isEmployee && (
                      <Table.Cell>
                        {getKeyValue(item, "returnedAt") ? (
                          "-"
                        ) : (
                          <Button
                            onPress={() =>
                              updateRentedMedia(getKeyValue(item, "id"))
                            }
                            isDisabled={!isEmployee}
                          >
                            zurückgegeben
                          </Button>
                        )}
                      </Table.Cell>
                    )}
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
