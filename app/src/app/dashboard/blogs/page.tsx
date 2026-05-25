"use client";
import { useState, useCallback, useMemo } from "react";
import { BlogResponseDto } from "@/types/blog.type";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Selection, SortDescriptor } from "@nextui-org/table";
import { Image } from "@nextui-org/image";
import { FiTrash2, FiEdit3, FiPlusCircle, FiFileText } from "react-icons/fi";
import { Column, DataTable } from "@/components/PagesComponents/UniTable/UniTable";
import { DeleteDialog } from "@/components/PagesComponents/DeleteDialog/DeleteDialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DeleteBlogMutation, GetBlogs } from "@/lib/actions/blogs.actions";

export default function BlogsComponent() {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [page, setPage] = useState(1);
  const [deleteBlog, setDeleteBlog] = useState<BlogResponseDto | null>(null);
  const rowsPerPage = 10;

  // Fetch blogs data
  const { data: blogsData, isPending: isLoading } = GetBlogs({
    search: filterValue,
    limit: rowsPerPage,
    page,
  });

  // Delete mutation
  const { deleteBlog: deleteBlogMutation, isPending: isDeleting } = DeleteBlogMutation({
    id: deleteBlog?.id || "",
    page,
  });

  const handleDeleteClick = useCallback((blog: BlogResponseDto) => {
    setDeleteBlog(blog);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteBlog) return;
    try {
      await deleteBlogMutation();
      toast.success("تم حذف المقال بنجاح");
      setDeleteBlog(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المقال");
    }
  };

  const handleEdit = useCallback(
    (blog: BlogResponseDto) => {
      router.push(`/dashboard/blogs/${blog.id}`);
    },
    [router]
  );

  const handleAddBlog = useCallback(() => {
    router.push("/dashboard/blogs/new");
  }, [router]);

  // Memoized columns definition
  const columns = useMemo<Column<BlogResponseDto>[]>(
    () => [
      {
        key: "blog",
        label: "المقال",
        searchable: true,
        render: (blog) => (
          <div className="flex items-center gap-3">
            {blog.image ? (
              <Image
                src={blog.image}
                alt={blog.title}
                width={48}
                height={48}
                className="rounded-lg object-cover w-12 h-12 border border-divider"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-default-100 flex items-center justify-center border border-divider">
                <FiFileText className="text-default-400" size={20} />
              </div>
            )}
            <div>
              <p className="font-medium text-sm line-clamp-1">{blog.title}</p>
              <p className="text-tiny text-default-400 line-clamp-1">{blog.summary}</p>
            </div>
          </div>
        ),
      },
      {
        key: "status",
        label: "الحالة",
        render: (_blog) => (
          <Chip color="success" variant="flat" size="sm">
            منشور
          </Chip>
        ),
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (blog) => (
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-primary-500"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(blog);
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
                handleDeleteClick(blog);
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
    let filtered = blogsData?.blogs || [];

    if (sortDescriptor) {
      filtered = [...filtered].sort((a, b) => {
        let first = a[sortDescriptor.column as keyof BlogResponseDto];
        let second = b[sortDescriptor.column as keyof BlogResponseDto];

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
  }, [blogsData, sortDescriptor]);

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
        <h1 className="text-2xl font-bold">المقالات</h1>
        <Button
          color="primary"
          endContent={<FiPlusCircle size={18} />}
          className="font-semibold"
          onClick={handleAddBlog}
        >
          إضافة مقال
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredAndSortedData}
        total={blogsData?.total || 0}
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
        isOpen={!!deleteBlog}
        onClose={() => setDeleteBlog(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`حذف المقال "${deleteBlog?.title}"`}
        itemType="المقال"
      />
    </div>
  );
}