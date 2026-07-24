"use client";
import {
  Table,
  Input,
  Chip,
  Button,
  Link,
  SortDescriptor,
  Checkbox,
} from "@heroui/react";
import React from "react";
import { MediaTableProp } from "@/models/mediaTable";
import { BsPen } from "react-icons/bs";
import { mediaTypesWithIcons } from "@/models/mediaTypesWithIcons";
import { setMediaExists } from "@/actions/media";

const getKeyValue = <T, K extends keyof T>(item: T, key: K): T[K] => item[key];

interface MediaTableProps {
  mediaTableProps: MediaTableProp[] | null;
  showExistCheckbox?: boolean;
  showActions?: boolean;
  updateMediaTableProps?: () => void;
}

export default function MediaTable({
  mediaTableProps,
  showActions = false,
  showExistCheckbox = false,
  updateMediaTableProps = () => {},
}: MediaTableProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });

  const medias = mediaTableProps;
  const rowsPerPage = 10;
  const hasSearchFilter = Boolean(filterValue);

  const pages = Math.ceil((medias?.length ?? 0) / rowsPerPage);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...(medias ?? [])];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((media) =>
        media.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [medias, filterValue, hasSearchFilter]);

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
          className="w-full sm:max-w-[44%]"
          placeholder="Suche nach Titel..."
          value={filterValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    );
  }, [filterValue, onSearchChange]);

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
  }, [page, pages]);

  const handleCheckboxChange = async (id: string, exists: boolean) => {
    await setMediaExists(id, exists);
    updateMediaTableProps();
  };

  return (
    <section>
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
              <Table.Column key="rented" allowsSorting>
                Verfugbarkeit
              </Table.Column>
              {showExistCheckbox && (
                <Table.Column key="exists">Existiert</Table.Column>
              )}
              {showActions && (
                <Table.Column key="actions">Aktionen</Table.Column>
              )}
            </Table.Header>
            <Table.Body items={sortedItems}>
              {(item: MediaTableProp) => {
                const mediaTypeWithIcon = mediaTypesWithIcons.find(
                  (icon) => icon.enum === getKeyValue(item, "type"),
                );

                return (
                  <Table.Row id={item.id} key={item.id}>
                    <Table.Cell>
                      {mediaTypeWithIcon ? mediaTypeWithIcon.icon : ""}
                    </Table.Cell>
                    <Table.Cell>{getKeyValue(item, "title")}</Table.Cell>
                    <Table.Cell>{getKeyValue(item, "authorName")}</Table.Cell>
                    <Table.Cell>{getKeyValue(item, "locationName")}</Table.Cell>
                    <Table.Cell>
                      <Chip
                        className="text-default-600 gap-1 border-none capitalize"
                        color={
                          Boolean(getKeyValue(item, "rented"))
                            ? "danger"
                            : "success"
                        }
                        size="sm"
                      >
                        {Boolean(getKeyValue(item, "rented"))
                          ? "ausgeliehen"
                          : "verfugbar"}
                      </Chip>
                    </Table.Cell>
                    {showExistCheckbox && (
                      <Table.Cell>
                        <Checkbox
                          isSelected={Boolean(getKeyValue(item, "exists"))}
                          onChange={(isSelected) =>
                            handleCheckboxChange(item.id, Boolean(isSelected))
                          }
                        />
                      </Table.Cell>
                    )}
                    {showActions && (
                      <Table.Cell>
                        <Link
                          href={`/media/edit/${getKeyValue(item, "id")}`}
                          className="border-default-200 inline-flex h-8 w-8 items-center justify-center rounded-md border"
                        >
                          <BsPen />
                        </Link>
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
