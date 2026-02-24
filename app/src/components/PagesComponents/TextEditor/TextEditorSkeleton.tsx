import { Skeleton } from "@nextui-org/skeleton";
import React from "react";

function TextEditorSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="rounded-lg">
        <div className="w-full h-20 rounded-lg bg-default-900" />
      </Skeleton>
      <Skeleton className="rounded-lg">
        <div className="w-full h-5 rounded-lg bg-default-900" />
      </Skeleton>
      <Skeleton className="rounded-lg">
        <div className="w-full h-5 rounded-lg bg-default-900" />
      </Skeleton>
      <Skeleton className="rounded-lg">
        <div className="w-full h-5 rounded-lg bg-default-900" />
      </Skeleton>
    </div>
  );
}

export default TextEditorSkeleton;
