import React from "react";

import { FiTrash2 } from "react-icons/fi";
import { Dialog } from "../UniDialog/UniDialog";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
  itemType?: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "حذف العنصر",
  description = "هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
  loading = false,
  itemType = "العنصر",
}: DeleteDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      type="danger"
      confirmText="حذف"
      loading={loading}
      icon={<FiTrash2 size={24} className="text-danger" />}>
      <p className="text-default-500">{description.replace("العنصر", itemType)}</p>
    </Dialog>
  );
}
