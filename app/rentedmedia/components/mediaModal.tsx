"use client";
import React from "react";
import {
  Input,
  Modal,
  Button,
  Table,
  SortDescriptor,
  Selection,
} from "@heroui/react";
import { MediaTableProp } from "@/models/mediaTable";
import { mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";

const getKeyValue = <T, K extends keyof T>(item: T, key: K): T[K] => item[key];

export default function MediaModal({
  mediaList,
  show,
  close,
  setMedia,
}: {
  mediaList: MediaTableProp[] | null;
  show: boolean;
  close: () => void;
  setMedia: (selectedMedia: MediaTableProp) => void;
}) {
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "lastName",
    direction: "ascending",
  });
  const [selectedMediaKeys, setSelectedMediaKeys] = React.useState<Selection>(
    new Set([]),
  );

  const medias = mediaList;
  const rowsPerPage = 10;
  const hasSearchFilter = Boolean(filterValue);

  const MediaPages = Math.ceil((medias?.length ?? 0) / rowsPerPage);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...(medias ?? [])];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((Media) =>
        Media.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [medias, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof MediaTableProp] ?? "";
      const second = b[sortDescriptor.column as keyof MediaTableProp] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onSearchChange = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    },
    [],
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Suche nach Titel..."
          value={filterValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    );
  }, [filterValue, onSearchChange, hasSearchFilter]);

  const bottomMediaContent = React.useMemo(() => {
    return (
      <div className="medias-center flex justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onPress={() => setPage((prev) => Math.max(1, prev - 1))}
            isDisabled={page <= 1}
          >
            Zurueck
          </Button>
          <span className="text-sm">
            Seite {page} / {Math.max(1, MediaPages)}
          </span>
          <Button
            variant="ghost"
            onPress={() =>
              setPage((prev) => Math.min(Math.max(1, MediaPages), prev + 1))
            }
            isDisabled={page >= Math.max(1, MediaPages)}
          >
            Weiter
          </Button>
        </div>
      </div>
    );
  }, [page, MediaPages]);

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={show}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            close();
          }
        }}
      >
        <Modal.Container size="full">
          <Modal.Dialog>
            <Modal.Header className="flex flex-col gap-1">
              <Modal.Heading>verfügbare Medien</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {topContent}
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="Media table">
                    <Table.Header>
                      <Table.Column key="type" className="w-10" isRowHeader>
                        Typ
                      </Table.Column>
                      <Table.Column key="id" allowsSorting>
                        Id
                      </Table.Column>
                      <Table.Column key="title" allowsSorting>
                        Title
                      </Table.Column>
                      <Table.Column key="authorName" allowsSorting>
                        Author
                      </Table.Column>
                      <Table.Column key="locationName" allowsSorting>
                        Lokation
                      </Table.Column>
                    </Table.Header>
                    <Table.Body items={sortedItems}>
                      {(item: MediaTableProp) => {
                        const mediaTypeWithIcon = mediaTypesWithIcons.find(
                          (icon) => icon.enum === getKeyValue(item, "type"),
                        );

                        return (
                          <Table.Row key={item.id}>
                            <Table.Cell>
                              {mediaTypeWithIcon ? mediaTypeWithIcon.icon : ""}
                            </Table.Cell>
                            <Table.Cell>{getKeyValue(item, "id")}</Table.Cell>
                            <Table.Cell>
                              {getKeyValue(item, "title")}
                            </Table.Cell>
                            <Table.Cell>
                              {getKeyValue(item, "authorName")}
                            </Table.Cell>
                            <Table.Cell>
                              {getKeyValue(item, "locationName")}
                            </Table.Cell>
                          </Table.Row>
                        );
                      }}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
              {bottomMediaContent}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={close}>
                schließen
              </Button>
              <Button
                onPress={() => {
                  const selectedMedia = sortedItems.find(
                    (x) =>
                      x.id ==
                      (selectedMediaKeys as Set<string>).values().next().value,
                  );
                  if (selectedMedia) {
                    setMedia(selectedMedia);
                  }

                  close();
                }}
              >
                auswählen
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
