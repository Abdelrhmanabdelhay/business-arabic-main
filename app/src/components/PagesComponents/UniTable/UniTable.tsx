"use client";
import React, { ReactNode, Key } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor as NextUISortDescriptor,
  Selection,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { Chip, ChipProps } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { FiSearch } from "react-icons/fi";

export type SortDescriptor = Partial<NextUISortDescriptor>;

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (item: T) => ReactNode;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  sortDescriptor?: SortDescriptor;
  filterValue?: string;
  selectionMode?: "single" | "multiple" | "none";
  selectedKeys?: Selection;
  loading?: boolean;
  showSearch?: boolean;
  emptyContent?: React.ReactNode;
  classNames?: {
    wrapper?: string;
    table?: string;
    search?: string;
    pagination?: string;
  };
  statusMapping?: {
    [key: string]: {
      color: ChipProps["color"];
      label?: string;
    };
  };
  onPageChange?: (page: number) => void;
  onSortChange?: (descriptor: SortDescriptor) => void;
  onSelectionChange?: (keys: Selection) => void;
  onSearchChange?: (value: string) => void;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: Key }>({
  columns,
  data,
  total,
  page,
  pageSize,
  sortDescriptor,
  filterValue = "",
  selectionMode,
  selectedKeys,
  loading = false,
  showSearch = true,
  emptyContent,
  classNames,
  statusMapping,
  onPageChange,
  onSortChange,
  onSelectionChange,
  onSearchChange,
  onRowClick,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);

  const renderCell = (item: T, columnKey: Key): ReactNode => {
    const column = columns.find((col) => col.key === columnKey);

    if (!column) return null;

    if (column.render) {
      return column.render(item);
    }

    const value = item[columnKey as keyof T];

    if (statusMapping && typeof value === "string" && statusMapping[value]) {
      return (
        <Chip color={statusMapping[value].color} variant="flat" size="sm" className="capitalize">
          {statusMapping[value].label || value}
        </Chip>
      );
    }

    // Convert the value to a string or ReactNode
    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  return (
    <div className={`space-y-4 ${classNames?.wrapper}`}>
      {showSearch && (
        <div className={`flex gap-4 items-center ${classNames?.search}`}>
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="بحث..."
            startContent={<FiSearch className="ml-2 text-default-300" />}
            value={filterValue}
            onClear={() => onSearchChange?.("")}
            onChange={(e) => onSearchChange?.(e.target.value)}
            classNames={{
              inputWrapper: "border-1",
            }}
          />
        </div>
      )}

      <div className="relative">
        <Table
          aria-label="Table"
          isHeaderSticky
          classNames={{
            wrapper: "max-h-[calc(100vh-350px)] shadow-sm border-1 border-default-200 rounded-medium",
            table: classNames?.table,
          }}
          selectionMode={selectionMode}
          // @ts-ignore
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor as NextUISortDescriptor}
          onSelectionChange={onSelectionChange}
          onSortChange={onSortChange}>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key.toString()} allowsSorting={column.sortable} className="text-right">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data}
            emptyContent={emptyContent || "لا توجد بيانات"}
            isLoading={loading}
            loadingContent={<Spinner label="جاري التحميل..." />}>
            {(item) => (
              <TableRow key={item.id} className={onRowClick ? "cursor-pointer" : ""} onClick={() => onRowClick?.(item)}>
                {(columnKey) => (
                  <TableCell className={columns.find((col) => col.key === columnKey)?.cellClassName}>
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Spinner size="lg" />
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className={`flex justify-between items-center px-2 ${classNames?.pagination}`}>
          <span className="text-small text-default-400">إجمالي {total} سجل</span>
          <Pagination
            showControls
            classNames={{
              cursor: "bg-primary-500",
            }}
            color="primary"
            page={page}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
