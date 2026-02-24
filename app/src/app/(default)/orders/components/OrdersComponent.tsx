"use client";
import { useState, useCallback, useMemo } from "react";
import { Order } from "@/types/order.type";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Selection, SortDescriptor } from "@nextui-org/table";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/modal";
import { FiEye } from "react-icons/fi";
import { Column, DataTable } from "@/components/PagesComponents/UniTable/UniTable";
import { GetOrders, GetOrder } from "@/lib/actions/orders.actions";
import { Spinner } from "@nextui-org/spinner";

export default function OrdersComponent() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rowsPerPage = 10;

  // Fetch orders data
  const { data: ordersData, isPending: isLoading } = GetOrders({
    search: filterValue,
    limit: rowsPerPage,
    page
  });

  // Fetch selected order details
  const { data: orderDetails, isPending: isLoadingDetails } = GetOrder({
    id: selectedOrderId || ""
  });

  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrderId(order.id);
    onOpen();
  }, [onOpen]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  // Memoized columns definition
  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        key: "id",
        label: "رقم الطلب",
        searchable: true,
        render: (order) => (
          <span className="font-medium">#{order.id.slice(0, 8)}</span>
        ),
      },
      {
        key: "userName",
        label: "العميل",
        searchable: true,
        render: (order) => (
          <div>
            <p className="font-medium text-sm">{order.userName}</p>
            <p className="text-tiny text-default-400">{order.userEmail}</p>
          </div>
        ),
      },
      {
        key: "status",
        label: "الحالة",
        sortable: true,
        render: (order) => (
          <Chip color={getStatusColor(order.status)} variant="flat" size="sm">
            {getStatusText(order.status)}
          </Chip>
        ),
      },
      {
        key: "total",
        label: "المبلغ",
        sortable: true,
        render: (order) => (
          <span className="font-medium">{order.total.toLocaleString('ar-SA')} ريال</span>
        ),
      },
      {
        key: "createdAt",
        label: "تاريخ الطلب",
        sortable: true,
        render: (order) => new Date(order.createdAt).toLocaleDateString("ar-SA"),
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (order) => (
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-400 hover:text-primary-500"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(order);
              }}>
              <FiEye size={18} />
            </Button>
          </div>
        ),
      },
    ],
    [handleViewDetails]
  );

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = ordersData?.orders || [];

    if (sortDescriptor) {
      filtered = [...filtered].sort((a, b) => {
        let first = a[sortDescriptor.column as keyof Order];
        let second = b[sortDescriptor.column as keyof Order];

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
  }, [ordersData, sortDescriptor]);

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">الطلبات</h1>
      </div>

      <DataTable
        columns={columns}
        data={filteredAndSortedData}
        total={ordersData?.allOrdersCount || 0}
        page={page}
        pageSize={rowsPerPage}
        sortDescriptor={sortDescriptor}
        filterValue={filterValue}
        selectedKeys={selectedKeys}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        onSelectionChange={handleSelectionChange}
        onSearchChange={setFilterValue}
        loading={isLoading}
        classNames={{
          wrapper: "shadow-none",
        }}
      />

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                تفاصيل الطلب #{orderDetails?.id.slice(0, 8)}
              </ModalHeader>
              <ModalBody>
                {isLoadingDetails ? (
                  <div className="flex justify-center p-4">
                    <Spinner size="lg" />
                  </div>
                ) : orderDetails ? (
                  <div className="space-y-4 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-default-400">العميل</h4>
                        <p>{orderDetails.userName}</p>
                        <p className="text-sm text-default-400">{orderDetails.userEmail}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-default-400">حالة الطلب</h4>
                        <Chip color={getStatusColor(orderDetails.status)} variant="flat" size="sm">
                          {getStatusText(orderDetails.status)}
                        </Chip>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-default-400 mb-2">المنتجات</h4>
                      <div className="space-y-2">
                        {orderDetails.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-2 bg-default-100 rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-default-400">الكمية: {item.quantity}</p>
                            </div>
                            <p className="font-medium">{item.price.toLocaleString('ar-SA')} ريال</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <h4 className="font-medium">المجموع</h4>
                      <p className="font-bold text-lg">{orderDetails.total.toLocaleString('ar-SA')} ريال</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-danger p-4">
                    حدث خطأ في تحميل تفاصيل الطلب
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
