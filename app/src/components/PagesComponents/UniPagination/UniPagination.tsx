"use client";
import { Pagination } from "@nextui-org/pagination";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";


export interface PaginationMeta {
  currentPage: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UniPaginationProps {
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitControl?: boolean;
  className?: string;
  limitOptions?: number[];
}

function UniPagination({
  paginationMeta,
  onPageChange,
  onLimitChange,
  showLimitControl = true,
  className = "",
  limitOptions = [5, 10, 20, 30, 40, 50],
}: UniPaginationProps) {
  const items = limitOptions.map((option) => ({
    key: option.toString(),
    label: option.toString(),
  }));

  return (
    <div className={`flex flex-col md:flex-row items-center gap-4 ${className}`}>
      <Pagination
        showControls
        total={paginationMeta.totalPages}
        initialPage={paginationMeta.currentPage}
        page={paginationMeta.currentPage}
        onChange={onPageChange}
      />

      {showLimitControl && onLimitChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-default-600">Items per page:</span>
          <Select
            aria-label="Items per page"
            size="sm"
            defaultSelectedKeys={[paginationMeta.limit.toString()]}
            selectedKeys={[paginationMeta.limit.toString()]}
            className="w-[100px] min-w-[100px]"
            variant="flat"
            disallowEmptySelection={true}
            scrollShadowProps={{
              isEnabled: false,
            }}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0]?.toString();

              if (selected) onLimitChange(Number(selected));
            }}>
            {items.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>
      )}

      <div className="text-sm text-default-600">Total: {paginationMeta.totalDocs} items</div>
    </div>
  );
}

export default UniPagination;
