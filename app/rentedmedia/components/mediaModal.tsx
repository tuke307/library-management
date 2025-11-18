"use client";
import React from "react";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  SortDescriptor,
  Selection,
} from "@heroui/react";
import { MediaTableProp } from "@/models/mediaTable";
import { mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";

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
  const { onClose, onOpen, onOpenChange } = useDisclosure();
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
          isClearable
          placeholder="Suche nach Titel..."
          size="sm"
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />
      </div>
    );
  }, [filterValue, onSearchChange, hasSearchFilter]);

  const bottomMediaContent = React.useMemo(() => {
    return (
      <div className="flex medias-center justify-between px-2 py-2">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={page}
          total={MediaPages}
          variant="light"
          onChange={setPage}
        />
      </div>
    );
  }, [page, MediaPages]);

  return (
    <Modal
      backdrop="blur"
      size="5xl"
      isOpen={show}
      onClose={close}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          verfügbare Medien
        </ModalHeader>
        <ModalBody>
          <Table
            aria-label="Media table"
            topContent={topContent}
            topContentPlacement="outside"
            bottomContent={bottomMediaContent}
            bottomContentPlacement="outside"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectionMode="single"
            selectedKeys={selectedMediaKeys}
            onSelectionChange={setSelectedMediaKeys}
          >
            <TableHeader>
              <TableColumn key="type" className="w-10">Typ</TableColumn>
              <TableColumn key="id" allowsSorting>
                Id
              </TableColumn>
              <TableColumn key="title" allowsSorting>
                Title
              </TableColumn>
              <TableColumn key="authorName" allowsSorting>
                Author
              </TableColumn>
              <TableColumn key="locationName" allowsSorting>
                Lokation
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={"keine Medien gefunden"}>
              {sortedItems.map((item) => {
                const mediaTypeWithIcon = mediaTypesWithIcons.find(
                  (icon) => icon.enum === getKeyValue(item, "type"),
                );

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {mediaTypeWithIcon ? mediaTypeWithIcon.icon : ""}
                    </TableCell>
                    <TableCell>{getKeyValue(item, "id")}</TableCell>
                    <TableCell>{getKeyValue(item, "title")}</TableCell>
                    <TableCell>{getKeyValue(item, "authorName")}</TableCell>
                    <TableCell>{getKeyValue(item, "locationName")}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={close}>
            schließen
          </Button>
          <Button
            color="primary"
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
