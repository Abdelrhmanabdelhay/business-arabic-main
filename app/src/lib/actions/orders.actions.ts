"use client";
import { useApi } from "@/hooks/useApi";
import { Order } from "@/types/order.type";
import { keepPreviousData } from "@tanstack/react-query";

interface OrdersResponse {
  orders: Order[];
  allOrdersCount: number;
  resultsCount: number;
  page: number;
  limit: number;
  message?: string;
}

const GetOrders = ({ search, limit, page }: { search?: string; limit: number; page: number }) => {
  const { useGetQuery } = useApi();

  let url = "/orders";

  if (search) {
    url += `/search?query=${search}`;
  } else {
    url += `?limit=${limit}&page=${page}`;
  }
  
  const { data, isPending, isError, error, isSuccess } = useGetQuery<OrdersResponse>(url, undefined, {
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isError, error, isSuccess };
};

const GetOrder = ({ id }: { id: string }) => {
  const { useGetQuery } = useApi();

  const { data, isPending, isError, error, isSuccess } = useGetQuery<Order>(`/orders/${id}`);

  return { data, isPending, isError, error, isSuccess };
};

const UpdateOrderMutation = ({ id }: { id: string }) => {
  const { usePatchMutation } = useApi();

  const {
    mutateAsync: updateOrder,
    isPending,
    error,
    isError,
    isSuccess,
  } = usePatchMutation(`/orders/${id}`);

  return { updateOrder, isPending, error, isError, isSuccess };
};

export { GetOrders, GetOrder, UpdateOrderMutation };
