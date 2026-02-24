"use client";
import { keepPreviousData } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { Media } from "@/types/media.type";

interface MediaResponse {
  data: Media[];
  success: boolean;
  message: string;
  currentPage: number;
  totalPages: number;
  totalImages: number;
  imagesCount: number;
}
export interface MediaInputs {
  images: File[];
  titles: string[];
  descriptions: string[];
}

const GetMedia = ({ limit, page }: { limit: number; page: number }) => {
  const { useGetQuery } = useApi();
  const { data, isPending, isError, error, isSuccess } = useGetQuery<MediaResponse>(
    `/media?limit=${limit}&page=${page}`,
    undefined,
    {
      placeholderData: keepPreviousData,
    }
  );

  return { data, isPending, isError, error, isSuccess };
};

const GetSingleMedia = ({ enabled = true, id }: { enabled?: boolean; id: string }) => {
  const { useGetQuery } = useApi();
  const { data, isPending, isError, error, isSuccess } = useGetQuery<Media>(`/media/getOne?url=${id}`, undefined, {
    enabled,
  });

  return { data, isPending, isError, error, isSuccess };
};

const AddFileMutation = () => {
  const { usePostMutation } = useApi();

  const { mutateAsync: addFile, isPending, error, isError, isSuccess } = usePostMutation("/media");

  return { addFile, isPending, error, isError, isSuccess };
};

export { AddFileMutation, GetMedia, GetSingleMedia };
