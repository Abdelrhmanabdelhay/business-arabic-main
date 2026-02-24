"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { FiPlus, FiEdit3, FiTrash2, FiEye, FiDollarSign } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

import { Column, DataTable, SortDescriptor } from "@/components/PagesComponents/UniTable/UniTable";
import { DeleteDialog } from "@/components/PagesComponents/DeleteDialog/DeleteDialog";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project.type";

type ProjectsComponentProps = {
  projects: Project[];

  onDelete: (id: string) => Promise<void>;

  isDeleting: boolean;

  selectedId: string;

  isDeleted: boolean;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(price);
};

const ProjectsComponent: React.FC<ProjectsComponentProps> = ({ projects, onDelete, isDeleted }) => {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rowsPerPage = 10;

  // Columns definition
  const columns = useMemo<Column<Project>[]>(
    () => [
      {
        key: "image",
        label: "الصورة",
        width: 80,
        render: (project) => (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <Image src={project.image} alt={project.name} fill className="object-cover" sizes="64px" />
          </div>
        ),
      },
      {
        key: "name",
        label: "اسم دراسة الجدوي",
        searchable: true,
        sortable: true,
        render: (project) => (
          <div className="flex flex-col gap-1">
            <p className="font-medium text-sm">{project.name}</p>
            <p className="text-xs text-default-400 line-clamp-1">{project.description}</p>
          </div>
        ),
      },
      {
        key: "price",
        label: "السعر",
        sortable: true,
        width: 150,
        render: (project) => (
          <Chip
            startContent={<FiDollarSign size={14} />}
            variant="flat"
            color="success"
            classNames={{
              base: "bg-success-50",
              content: "text-success-600 font-medium",
            }}>
            {formatPrice(project.price)}
          </Chip>
        ),
      },
      {
        key: "actions",
        label: "الإجراءات",
        width: 130,
        render: (project) => (
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-primary-500"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/projects/${project.id}`);
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
                handleDeleteClick(project);
              }}>
              <FiTrash2 size={18} />
            </Button>
          </div>
        ),
      },
    ],
    [router]
  );

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...projects];

    if (filterValue) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          project.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (sortDescriptor) {
      filtered.sort((a, b) => {
        let first = a[sortDescriptor.column as keyof Project];
        let second = b[sortDescriptor.column as keyof Project];

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
  }, [filterValue, sortDescriptor, projects]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData.slice(start, end);
  }, [page, filteredData]);

  // Event handlers
  const handleSelectionChange = useCallback((keys: Set<string>) => {
    setSelectedKeys(keys);
  }, []);

  const handleSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleDeleteClick = useCallback((project: Project) => {
    setDeleteProject(project);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteProject) return;
    onDelete(deleteProject.id);
  };

  useEffect(() => {
    if (isDeleted) {
      setDeleteProject(null);
    }
  }, [isDeleted]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">دراسات الجدوي الجاهزة</h1>
          <p className="text-default-500 mt-1">إدارة وعرض دراسات الجدوي الجاهزة للبيع</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button
            color="primary"
            endContent={<FiPlus size={18} />}
            className="font-semibold bg-gradient-to-r from-primary-500 to-primary-700"
            size="lg">
            إضافة دراسة جدوي جديد
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
        selectedKeys={selectedKeys}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        // @ts-ignore
        onSelectionChange={handleSelectionChange}
        onSearchChange={setFilterValue}
        loading={loading}
        classNames={{
          wrapper: "shadow-none",
        }}
      />

      <DeleteDialog
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`حذف مشروع "${deleteProject?.name}"`}
        itemType="المشروع"
      />
    </div>
  );
};

export default ProjectsComponent;
