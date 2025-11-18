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
import { Author } from "@prisma/client";

export default function AuthorModal({
  authorList,
  show,
  close,
  setAuthor,
}: {
  authorList: Author[] | null;
  show: boolean;
  close: () => void;
  setAuthor: (selectedAuthor: Author) => void;
}) {
  const { onClose, onOpen, onOpenChange } = useDisclosure();
  const [authorFilterValue, setAuthorFilterValue] = React.useState("");
  const [authorPage, setAuthorPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "lastName",
    direction: "ascending",
  });
  const [selectedAuthorKeys, setSelectedAuthorKeys] = React.useState<Selection>(
    new Set([]),
  );

  const authors = authorList;
  const rowsPerPage = 10;
  const hasSearchFilter = Boolean(authorFilterValue);

  const authorPages = Math.ceil((authors?.length ?? 0) / rowsPerPage);

  const filteredAuthorItems = React.useMemo(() => {
    let filteredUsers = [...(authors ?? [])];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((author) =>
        author.lastName.toLowerCase().includes(authorFilterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [authors, authorFilterValue]);

  const authorItems = React.useMemo(() => {
    const start = (authorPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredAuthorItems.slice(start, end);
  }, [authorPage, filteredAuthorItems, rowsPerPage]);

  const sortedAuthorItems = React.useMemo(() => {
    return [...authorItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Author] ?? "";
      const second = b[sortDescriptor.column as keyof Author] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, authorItems]);

  const onSearchChange = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (value) {
        setAuthorFilterValue(value);
        setAuthorPage(1);
      } else {
        setAuthorFilterValue("");
      }
    },
    [],
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <Input
          isClearable
          placeholder="Suche nach Nachname..."
          size="sm"
          value={authorFilterValue}
          variant="bordered"
          onClear={() => setAuthorFilterValue("")}
          onValueChange={onSearchChange}
        />
      </div>
    );
  }, [authorFilterValue, onSearchChange, hasSearchFilter]);

  const bottomAuthorContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={authorPage}
          total={authorPages}
          variant="light"
          onChange={setAuthorPage}
        />
      </div>
    );
  }, [authorPage, authorPages]);

  return (
    <Modal
      backdrop="blur"
      size="5xl"
      placeholder="center"
      isOpen={show}
      onClose={close}
      id="author-modal"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Authoren</ModalHeader>
        <ModalBody>
          <Table
            aria-label="author table"
            id="modal-author-table"
            topContent={topContent}
            topContentPlacement="outside"
            bottomContent={bottomAuthorContent}
            bottomContentPlacement="outside"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectionMode="single"
            selectedKeys={selectedAuthorKeys}
            onSelectionChange={setSelectedAuthorKeys}
          >
            <TableHeader>
              <TableColumn key="lastName" allowsSorting>
                Nachname
              </TableColumn>
              <TableColumn key="firstName" allowsSorting>
                Vorname
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={"keine authoren gefunden"}>
              {sortedAuthorItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getKeyValue(item, "lastName")}</TableCell>
                  <TableCell>{getKeyValue(item, "firstName")}</TableCell>
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
              const selectedAuthor = sortedAuthorItems.find(
                (x) =>
                  x.id ==
                  ((selectedAuthorKeys as Set<string>).values().next()
                    .value as number),
              );
              if (selectedAuthor) {
                setAuthor(selectedAuthor);
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
