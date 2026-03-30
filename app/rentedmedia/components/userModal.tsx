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
import type { User } from "@/client";

const getKeyValue = <T, K extends keyof T>(item: T, key: K): T[K] => item[key];

export default function UserModal({
  userList,
  show,
  close,
  setUser,
}: {
  userList: User[] | null;
  show: boolean;
  close: () => void;
  setUser: (selectedUser: User) => void;
}) {
  const [userFilterValue, setUserFilterValue] = React.useState("");
  const [userPage, setUserPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "lastName",
    direction: "ascending",
  });
  const [selectedUserKeys, setSelectedUserKeys] = React.useState<Selection>(
    new Set([]),
  );
  const users = userList;

  const rowsPerPage = 10;
  const hasSearchFilter = Boolean(userFilterValue);

  const UserPages = Math.ceil((users?.length ?? 0) / rowsPerPage);

  const filteredUserItems = React.useMemo(() => {
    let filteredUsers = [...(users ?? [])];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.lastName.toLowerCase().includes(userFilterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, userFilterValue]);

  const UserItems = React.useMemo(() => {
    const start = (userPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredUserItems.slice(start, end);
  }, [userPage, filteredUserItems, rowsPerPage]);

  const sortedUserItems = React.useMemo(() => {
    return [...UserItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof User] ?? "";
      const second = b[sortDescriptor.column as keyof User] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, UserItems]);

  const onSearchChange = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (value) {
        setUserFilterValue(value);
        setUserPage(1);
      } else {
        setUserFilterValue("");
      }
    },
    [],
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Suche nach Nachname..."
          value={userFilterValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    );
  }, [userFilterValue, onSearchChange, hasSearchFilter]);

  const bottomUserContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onPress={() => setUserPage((prev) => Math.max(1, prev - 1))}
            isDisabled={userPage <= 1}
          >
            Zurueck
          </Button>
          <span className="text-sm">
            Seite {userPage} / {Math.max(1, UserPages)}
          </span>
          <Button
            variant="ghost"
            onPress={() =>
              setUserPage((prev) => Math.min(Math.max(1, UserPages), prev + 1))
            }
            isDisabled={userPage >= Math.max(1, UserPages)}
          >
            Weiter
          </Button>
        </div>
      </div>
    );
  }, [userPage, UserPages]);

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
              <Modal.Heading>Kunden</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {topContent}
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="user table">
                    <Table.Header>
                      <Table.Column key="lastName" allowsSorting isRowHeader>
                        Nachname
                      </Table.Column>
                      <Table.Column key="firstName" allowsSorting>
                        Vorname
                      </Table.Column>
                    </Table.Header>
                    <Table.Body items={sortedUserItems}>
                      {(item: User) => (
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
              {bottomUserContent}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={close}>
                schließen
              </Button>
              <Button
                onPress={() => {
                  // get first selected key (may be string | undefined), convert to number safely
                  const selectedKey = (selectedUserKeys as Set<string>)
                    .values()
                    .next().value;
                  const selectedId =
                    selectedKey !== undefined ? Number(selectedKey) : undefined;

                  const selectedUser =
                    selectedId !== undefined
                      ? sortedUserItems.find((x) => x.id === selectedId)
                      : undefined;

                  if (selectedUser) {
                    setUser(selectedUser);
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
