"use client";
import { useState, useCallback, useMemo } from "react";
import { User } from "@/types/user.type";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Selection, SortDescriptor } from "@nextui-org/table";
import { Avatar } from "@nextui-org/avatar";
import { FiTrash2, FiEdit3, FiUserPlus } from "react-icons/fi";
import { Column, DataTable } from "@/components/PagesComponents/UniTable/UniTable";
import { DeleteDialog } from "@/components/PagesComponents/DeleteDialog/DeleteDialog";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { DeleteUserMutation, GetUsers } from "@/lib/actions/users.actions";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function UsersComponent() {
  const { user, token, isAuthenticated } = useUserStore()
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [page, setPage] = useState(1);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const rowsPerPage = 10;

  // Fetch users data
  const { data: usersData, isPending: isLoading } = GetUsers({
    search: filterValue,
    limit: rowsPerPage,
    page
  });

  // Delete mutation
  const { deleteUser: deleteUserMutation, isPending: isDeleting } = DeleteUserMutation({
    id: deleteUser?.id || "",
    // @ts-ignore
    page
  });

  const handleDeleteClick = useCallback((user: User) => {
    setDeleteUser(user);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteUser) return;

    try {
      // @ts-ignore
      await deleteUserMutation();
      toast.success("تم حذف المستخدم بنجاح");
      setDeleteUser(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المستخدم");
    }
  };

  // Memoized columns definition
  const columns = useMemo<Column<User>[]>(
    () => [
      {
        key: "user",
        label: "المستخدم",
        searchable: true,
        render: (user) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
              size="sm"
              className="border-2 border-white"
            />
            <div>
              <p className="font-medium text-sm">{user.fullName}</p>
              <p className="text-tiny text-default-400">{user.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        label: "الصلاحية",
        sortable: true,
        render: (user) => (
          <Chip color={user.role === "admin" ? "danger" : "primary"} variant="flat" size="sm">
            {user.role === "admin" ? "مدير" : "مستخدم"}
          </Chip>
        ),
      },
      {
        key: "createdAt",
        label: "تاريخ التسجيل",
        sortable: true,
        render: (user) => new Date(user.createdAt).toLocaleDateString("ar-SA"),
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (user) => (
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-primary-500"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(user);
              }}>
              <FiEdit3 size={18} />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-danger-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(user);
              }}>
              <FiTrash2 size={18} />
            </Button>
          </div>
        ),
      },
    ],
    [handleDeleteClick]
  );

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = usersData?.users || [];

    if (sortDescriptor) {
      filtered = [...filtered].sort((a, b) => {
        let first = a[sortDescriptor.column as keyof User];
        let second = b[sortDescriptor.column as keyof User];

        if (typeof first === "string") {
          first = first.toLowerCase();
          second = (second as string).toLowerCase();
        }

        if (first === undefined || second === undefined) {
          return 0;
        }
        let cmp = first < second ? -1 : 1;

        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }

        return cmp;
      });
    }

    return filtered;
  }, [usersData, sortDescriptor]);

  // Event handlers
  const handleSelectionChange = useCallback((keys: Selection) => {
    setSelectedKeys(keys);
  }, []);

  const handleSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleEdit = useCallback((user: User) => {
    router.push(`/dashboard/users/${user.id}`);
  }, [router]);

  const handleAddUser = useCallback(() => {
    router.push('/dashboard/users/new');
  }, [router]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">المستخدمين</h1>
        <Button
          color="primary"
          endContent={<FiUserPlus size={18} />}
          className="font-semibold"
          onClick={handleAddUser}
        >
          إضافة مستخدم
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredAndSortedData}
        total={usersData?.allUsersCount || 0}
        page={page}
        pageSize={rowsPerPage}
        sortDescriptor={sortDescriptor}
        filterValue={filterValue}
        selectedKeys={selectedKeys}
        onPageChange={handlePageChange}
        onSelectionChange={handleSelectionChange}
        onSearchChange={setFilterValue}
        loading={isLoading}
        classNames={{
          wrapper: "shadow-none",
        }}
      />

      <DeleteDialog
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`حذف المستخدم "${deleteUser?.fullName}"`}
        itemType="المستخدم"
      />
    </div>
  );
}