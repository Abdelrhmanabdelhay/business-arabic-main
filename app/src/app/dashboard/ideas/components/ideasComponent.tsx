"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { FiPlus, FiEdit3, FiTrash2 } from "react-icons/fi";

import { IdeaClub, IdeasComponentProps } from "@/types/ideas.types";
import { Column, DataTable, SortDescriptor } from "@/components/PagesComponents/UniTable/UniTable";
import { DeleteDialog } from "@/components/PagesComponents/DeleteDialog/DeleteDialog";
import { useRouter } from "next/navigation";
import Link from "next/link";

const IdeasComponent: React.FC<IdeasComponentProps> = ({ ideas, onDelete, isDeleted }) => {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");
  // @ts-ignore
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<string>());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteIdea, setDeleteIdea] = useState<IdeaClub | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rowsPerPage = 10;

  // Columns definition
  const columns = useMemo<Column<IdeaClub>[]>(
    () => [
      {
        key: "name",
        label: "اسم الفكرة",
        searchable: true,
        sortable: true,
        render: (idea) => (
          <div>
            <p className="font-medium text-sm">{idea.name}</p>
          </div>
        ),
      },
      {
        key: "description",
        label: "التفاصيل",
        render: (idea) => <p className="text-xs text-default-400 line-clamp-1">{idea.description}</p>,
      },
      {
        key: "createdAt",
        label: "تاريخ الإضافة",
        sortable: true,
        render: (idea) => (
          <span className="text-sm text-default-600">{new Date(idea.createdAt).toLocaleDateString("en-GB")}</span>
        ),
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (idea) => (
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-primary-500"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(idea);
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
                handleDeleteClick(idea);
              }}>
              <FiTrash2 size={18} />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...ideas];

    if (filterValue) {
      filtered = filtered.filter(
        (idea) =>
          idea.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          idea.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (sortDescriptor) {
      filtered.sort((a, b) => {
        let first = a[sortDescriptor.column as keyof IdeaClub];
        let second = b[sortDescriptor.column as keyof IdeaClub];

        if (first === undefined || second === undefined) return 0;

        if (typeof first === "string") {
          first = first.toLowerCase();
          second = (second as string).toLowerCase();
        }

        let cmp = first < second ? -1 : 1;

        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }

        return cmp;
      });
    }

    return filtered;
  }, [filterValue, sortDescriptor, ideas]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData.slice(start, end);
  }, [page, filteredData]);

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

  const handleView = useCallback((idea: IdeaClub) => {
    // Implement view logic
    console.log("View idea:", idea);
  }, []);

  const handleEdit = useCallback((idea: IdeaClub) => {
    // Implement edit logic
    console.log("Edit idea:", idea);
    router.push(`/dashboard/ideas/${idea.id}`);
  }, []);

  const handleDeleteClick = useCallback((idea: IdeaClub) => {
    setDeleteIdea(idea);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteIdea) return;
    onDelete(deleteIdea.id);
  };

  useEffect(() => {
    if (isDeleted) {
      setDeleteIdea(null);
    }
  }, [isDeleted]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">نادي الأفكار</h1>
          <p className="text-default-500 mt-1">اكتشف وإدارة أفكار المشاريع الجديدة</p>
        </div>
        <Link href="/dashboard/ideas/new">
          <Button
            color="primary"
            endContent={<FiPlus size={18} />}
            className="font-semibold bg-gradient-to-r from-primary-500 to-primary-700"
            size="lg">
            إضافة فكرة جديدة
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        total={filteredData.length}
        page={page}
        pageSize={rowsPerPage}
        sortDescriptor={sortDescriptor}
        filterValue={filterValue}
        //   @ts-ignore
        selectedKeys={selectedKeys}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        //   @ts-ignore
        onSelectionChange={handleSelectionChange}
        onSearchChange={setFilterValue}
        loading={loading}
        classNames={{
          wrapper: "shadow-none",
        }}
      />

      <DeleteDialog
        isOpen={!!deleteIdea}
        onClose={() => setDeleteIdea(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`حذف فكرة "${deleteIdea?.name}"`}
        itemType="الفكرة"
      />
    </div>
  );
};

export default IdeasComponent;
