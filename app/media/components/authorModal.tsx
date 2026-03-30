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
import type { Author } from "@/client";

const getKeyValue = <T, K extends keyof T>(item: T, key: K): T[K] => item[key];

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
          placeholder="Suche nach Nachname..."
          value={authorFilterValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    );
  }, [authorFilterValue, onSearchChange, hasSearchFilter]);

  const bottomAuthorContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onPress={() => setAuthorPage((prev) => Math.max(1, prev - 1))}
            isDisabled={authorPage <= 1}
          >
            Zurueck
          </Button>
          <span className="text-sm">
            Seite {authorPage} / {Math.max(1, authorPages)}
          </span>
          <Button
            variant="ghost"
            onPress={() =>
              setAuthorPage((prev) =>
                Math.min(Math.max(1, authorPages), prev + 1),
              )
            }
            isDisabled={authorPage >= Math.max(1, authorPages)}
          >
            Weiter
          </Button>
        </div>
      </div>
    );
  }, [authorPage, authorPages]);

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
              <Modal.Heading>Authoren</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {topContent}
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="author table">
                    <Table.Header>
                      <Table.Column key="lastName" allowsSorting isRowHeader>
                        Nachname
                      </Table.Column>
                      <Table.Column key="firstName" allowsSorting>
                        Vorname
                      </Table.Column>
                    </Table.Header>
                    <Table.Body items={sortedAuthorItems}>
                      {(item: Author) => (
                        <Table.Row key={item.id}>
                          <Table.Cell>
                            {getKeyValue(item, "lastName")}
                          </Table.Cell>
                          <Table.Cell>
                            {getKeyValue(item, "firstName")}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
              {bottomAuthorContent}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={close}>
                schließen
              </Button>
              <Button
                onPress={() => {
                  const selectedKey = (selectedAuthorKeys as Set<string>)
                    .values()
                    .next().value;
                  const selectedAuthor = selectedKey
                    ? sortedAuthorItems.find(
                        (x) => String(x.id) === selectedKey,
                      )
                    : undefined;
                  if (selectedAuthor) {
                    setAuthor(selectedAuthor);
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
