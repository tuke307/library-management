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
import { User } from "@prisma/client";

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
  const { onClose, onOpen, onOpenChange } = useDisclosure();
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
          isClearable
          placeholder="Suche nach Nachname..."
          size="sm"
          value={userFilterValue}
          variant="bordered"
          onClear={() => setUserFilterValue("")}
          onValueChange={onSearchChange}
        />
      </div>
    );
  }, [userFilterValue, onSearchChange, hasSearchFilter]);

  const bottomUserContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={userPage}
          total={UserPages}
          variant="light"
          onChange={setUserPage}
        />
      </div>
    );
  }, [userPage, UserPages]);

  return (
    <Modal
      backdrop="blur"
      size="5xl"
      isOpen={show}
      onClose={close}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Kunden</ModalHeader>
        <ModalBody>
          <Table
            aria-label="user table"
            topContent={topContent}
            topContentPlacement="outside"
            bottomContent={bottomUserContent}
            bottomContentPlacement="outside"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectionMode="single"
            selectedKeys={selectedUserKeys}
            onSelectionChange={setSelectedUserKeys}
          >
            <TableHeader>
              <TableColumn key="lastName" allowsSorting>
                Nachname
              </TableColumn>
              <TableColumn key="firstName" allowsSorting>
                Vorname
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={"keine nutzer gefunden."}>
              {sortedUserItems.map((item) => (
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
              // get first selected key (may be string | undefined), convert to number safely
              const selectedKey = (selectedUserKeys as Set<string>).values().next()
                .value;
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
