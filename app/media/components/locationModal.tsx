"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
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
import { Location } from "@prisma/client";

export default function LocationModal({
  freeLocations,
  show,
  close,
  setLocation,
}: {
  freeLocations: Location[] | null;
  show: boolean;
  close: () => void;
  setLocation: (selectedLocation: Location) => void;
}) {
  const [locationPage, setLocationPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "floor",
    direction: "ascending",
  });
  const [selectedLocationKeys, setSelectedLocationKeys] =
    React.useState<Selection>(new Set([]));

  const locations = freeLocations;
  const rowsPerPage = 10;

  const locationPages = Math.ceil((locations?.length ?? 0) / rowsPerPage);

  const locationItems = React.useMemo(() => {
    const start = (locationPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return (locations ?? []).slice(start, end);
  }, [locationPage, locations, rowsPerPage]);

  const sortedLocationItems = React.useMemo(() => {
    return [...locationItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Location] ?? "";
      const second = b[sortDescriptor.column as keyof Location] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, locationItems]);

  const bottomLocationContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={locationPage}
          total={locationPages}
          variant="light"
          onChange={setLocationPage}
        />
      </div>
    );
  }, [locationPage, locationPages]);

  return (
    <Modal
      backdrop="blur"
      size="5xl"
      isOpen={show}
      onClose={close}
      id="location-modal"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          freie Lokationen
        </ModalHeader>
        <ModalBody>
          <Table
            aria-label="location table"
            id="modal-location-table"
            topContentPlacement="outside"
            bottomContent={bottomLocationContent}
            bottomContentPlacement="outside"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectionMode="single"
            selectedKeys={selectedLocationKeys}
            onSelectionChange={setSelectedLocationKeys}
            
          >
            <TableHeader>
              <TableColumn key="floor" allowsSorting>
                Etage
              </TableColumn>
              <TableColumn key="shelf" allowsSorting>
                Schrank
              </TableColumn>
              <TableColumn key="shelfSection" allowsSorting>
                Schranksektion
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={"keine lokationen gefunden"}>
              {sortedLocationItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getKeyValue(item, "floor")}</TableCell>
                  <TableCell>{getKeyValue(item, "shelf")}</TableCell>
                  <TableCell>{getKeyValue(item, "shelfSection")}</TableCell>
                </TableRow>
              ))}
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
              const selectedLocation = sortedLocationItems.find(
                (x) =>
                  x.id ==
                  ((selectedLocationKeys as Set<string>).values().next()
                    .value as number),
              );
              if (selectedLocation) {
                setLocation(selectedLocation);
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
