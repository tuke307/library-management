"use client";
import React from "react";
import { Modal, Button, Table, SortDescriptor, Selection } from "@heroui/react";
import type { Location } from "@/client";

const getKeyValue = <T, K extends keyof T>(item: T, key: K): T[K] => item[key];

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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onPress={() => setLocationPage((prev) => Math.max(1, prev - 1))}
            isDisabled={locationPage <= 1}
          >
            Zurueck
          </Button>
          <span className="text-sm">
            Seite {locationPage} / {Math.max(1, locationPages)}
          </span>
          <Button
            variant="ghost"
            onPress={() =>
              setLocationPage((prev) =>
                Math.min(Math.max(1, locationPages), prev + 1),
              )
            }
            isDisabled={locationPage >= Math.max(1, locationPages)}
          >
            Weiter
          </Button>
        </div>
      </div>
    );
  }, [locationPage, locationPages]);

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
              <Modal.Heading>freie Lokationen</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {bottomLocationContent}
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="location table">
                    <Table.Header>
                      <Table.Column key="floor" allowsSorting isRowHeader>
                        Etage
                      </Table.Column>
                      <Table.Column key="shelf" allowsSorting>
                        Schrank
                      </Table.Column>
                      <Table.Column key="shelfSection" allowsSorting>
                        Schranksektion
                      </Table.Column>
                    </Table.Header>
                    <Table.Body items={sortedLocationItems}>
                      {(item: Location) => (
                        <Table.Row key={item.id}>
                          <Table.Cell>{getKeyValue(item, "floor")}</Table.Cell>
                          <Table.Cell>{getKeyValue(item, "shelf")}</Table.Cell>
                          <Table.Cell>
                            {getKeyValue(item, "shelfSection")}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={close}>
                schließen
              </Button>
              <Button
                onPress={() => {
                  const selectedKey = (selectedLocationKeys as Set<string>)
                    .values()
                    .next().value;
                  let selectedLocation: Location | undefined;
                  if (selectedKey !== undefined) {
                    const selectedId = Number(selectedKey);
                    if (!Number.isNaN(selectedId)) {
                      selectedLocation = sortedLocationItems.find(
                        (x) => x.id === selectedId,
                      );
                    }
                  }
                  if (selectedLocation) {
                    setLocation(selectedLocation);
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
