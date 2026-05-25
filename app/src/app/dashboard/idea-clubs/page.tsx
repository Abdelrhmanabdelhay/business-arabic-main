"use client";
import { useState, useCallback, useMemo } from "react";
import { IdeaClub } from "@/types/ideas.types";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Selection, SortDescriptor } from "@nextui-org/table";
import { Image } from "@nextui-org/image";
import { FiTrash2, FiEdit3, FiPlusCircle, FiLayers } from "react-icons/fi";
import { Column, DataTable } from "@/components/PagesComponents/UniTable/UniTable";
import { DeleteDialog } from "@/components/PagesComponents/DeleteDialog/DeleteDialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DeleteIdeaClubMutation, GetIdeaClubs } from "@/lib/actions/idea-clubs.actions";

export default function IdeaClubsComponent() {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [page, setPage] = useState(1);
  const [deleteIdeaClub, setDeleteIdeaClub] = useState<IdeaClub | null>(null);
  const rowsPerPage = 10;

  // Fetch idea clubs data
  const { data: ideaClubsData, isPending: isLoading } = GetIdeaClubs({
    search: filterValue,
    limit: rowsPerPage,
    page,
  });

  // Delete mutation
  const { deleteIdeaClub: deleteIdeaClubMutation, isPending: isDeleting } = DeleteIdeaClubMutation({
    id: deleteIdeaClub?.id || "",
    page,
  });

  const handleDeleteClick = useCallback((ideaClub: IdeaClub) => {
    setDeleteIdeaClub(ideaClub);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteIdeaClub) return;
    try {
      await deleteIdeaClubMutation();
      toast.success("تم حذف نادي الأفكار بنجاح");
      setDeleteIdeaClub(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف نادي الأفكار");
    }
  };

  const handleEdit = useCallback(
    (ideaClub: IdeaClub) => {
      router.push(`/dashboard/idea-clubs/${ideaClub.id}`);
    },
    [router]
  );

  const handleAddIdeaClub = useCallback(() => {
    router.push("/dashboard/idea-clubs/new");
  }, [router]);

  // Memoized columns definition
  const columns = useMemo<Column<IdeaClub>[]>(
    () => [
      {
        key: "ideaClub",
        label: "نادي الأفكار",
        searchable: true,
        render: (ideaClub) => (
          <div className="flex items-center gap-3">
            {ideaClub.imageUrl ? (
              <Image
                src={ideaClub.imageUrl}
                alt={ideaClub.name}
                width={48}
                height={48}
                className="rounded-lg object-cover w-12 h-12 border border-divider"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-default-100 flex items-center justify-center border border-divider">
                <FiLayers className="text-default-400" size={20} />
              </div>
            )}
            <div>
              <p className="font-medium text-sm line-clamp-1">{ideaClub.name}</p>
              <p className="text-tiny text-default-400 line-clamp-1">{ideaClub.description}</p>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        label: "الفئة",
        render: (ideaClub) => (
          <Chip color="secondary" variant="flat" size="sm">
            {ideaClub.category}
          </Chip>
        ),
      },
      {
        key: "content",
        label: "عدد العناصر",
        render: (ideaClub) => (
          <span className="text-sm text-default-600">{ideaClub.content?.length ?? 0} عنصر</span>
        ),
      },
      {
        key: "createdAt",
        label: "تاريخ الإنشاء",
        render: (ideaClub) => (
          <span className="text-sm text-default-500">
            {new Date(ideaClub.createdAt).toLocaleDateString("ar-EG")}
          </span>
        ),
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (ideaClub) => (
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-primary-500"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(ideaClub);
              }}
            >
              <FiEdit3 size={18} />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-danger-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(ideaClub);
              }}
            >
              <FiTrash2 size={18} />
            </Button>
          </div>
        ),
      },
    ],
    [handleDeleteClick, handleEdit]
  );

  // Sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = ideaClubsData?.ideas || [];

    if (sortDescriptor) {
      filtered = [...filtered].sort((a, b) => {
        let first = a[sortDescriptor.column as keyof IdeaClub];
        let second = b[sortDescriptor.column as keyof IdeaClub];

        if (typeof first === "string") {
          first = first.toLowerCase();
          second = (second as string).toLowerCase();
        }

        if (first === undefined || second === undefined) return 0;

        let cmp = first < second ? -1 : 1;
        if (sortDescriptor.direction === "descending") cmp *= -1;
        return cmp;
      });
    }

    return filtered;
  }, [ideaClubsData, sortDescriptor]);

  const handleSelectionChange = useCallback((keys: Selection) => {
    setSelectedKeys(keys);
  }, []);

  const handleSortChange = useCallback((descriptor: Partial<SortDescriptor>) => {
    setSortDescriptor(descriptor as SortDescriptor);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">نوادي الأفكار</h1>
        <Button
          color="primary"
          endContent={<FiPlusCircle size={18} />}
          className="font-semibold"
          onClick={handleAddIdeaClub}
        >
          إضافة نادي أفكار
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredAndSortedData}
        total={ideaClubsData?.total || 0}
        page={page}
        pageSize={rowsPerPage}
        sortDescriptor={sortDescriptor}
        filterValue={filterValue}
        selectedKeys={selectedKeys}
        onPageChange={handlePageChange}
        onSelectionChange={handleSelectionChange}
        onSortChange={handleSortChange}
        onSearchChange={setFilterValue}
        loading={isLoading}
        classNames={{
          wrapper: "shadow-none",
        }}
      />

      <DeleteDialog
        isOpen={!!deleteIdeaClub}
        onClose={() => setDeleteIdeaClub(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`حذف نادي الأفكار "${deleteIdeaClub?.name}"`}
        itemType="نادي الأفكار"
      />
    </div>
  );
}