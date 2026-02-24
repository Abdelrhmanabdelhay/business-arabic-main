"use client";
import React, { ReactNode } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiInfo, 
  FiCheckCircle, 
  FiX 
} from "react-icons/fi";
import { Button } from "@nextui-org/button";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  children?: ReactNode;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  hideCloseButton?: boolean;
  hideActions?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  type = "info",
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  loading = false,
  icon,
  size = "md",
  hideCloseButton = false,
  hideActions = false,
}: DialogProps) {
  const colorMap = {
    danger: "danger",
    warning: "warning",
    info: "primary",
    success: "success",
  } as const;

  const bgColorMap = {
    danger: "bg-danger-50",
    warning: "bg-warning-50",
    info: "bg-primary-50",
    success: "bg-success-50",
  };

  const defaultIcons = {
    danger: <FiAlertCircle size={24} />,
    warning: <FiAlertTriangle size={24} />,
    info: <FiInfo size={24} />,
    success: <FiCheckCircle size={24} />,
  };

  const iconColor = `text-${colorMap[type]}`;

  return (
    <AnimatePresence>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        hideCloseButton
        classNames={{
          backdrop: "bg-black/60 backdrop-blur-sm backdrop-opacity-40",
          base: "border-0 bg-white dark:bg-[#19172c] shadow-2xl",
          header: "border-b-[1px] border-default-200/50",
          footer: "border-t-[1px] border-default-200/50",
          closeButton: "hidden",
          body: "py-6",
        }}>
        <ModalContent>
          {(onClose) => (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ModalHeader className="flex gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${bgColorMap[type]} ${iconColor}`}>
                    {icon || defaultIcons[type]}
                  </div>
                  <span className="text-lg font-semibold">{title}</span>
                </div>
                {!hideCloseButton && (
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={onClose}
                    className={`${iconColor} hover:opacity-80 transition-opacity`}
                  >
                    <FiX size={20} />
                  </Button>
                )}
              </ModalHeader>
              <ModalBody>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {children}
                </motion.div>
              </ModalBody>
              {!hideActions && (
                <ModalFooter>
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="bordered"
                      onPress={onClose}
                      className="flex-1 font-medium"
                      radius="sm"
                    >
                      {cancelText}
                    </Button>
                    <Button
                      color={colorMap[type]}
                      onPress={onConfirm}
                      isLoading={loading}
                      className="flex-1 font-medium"
                      radius="sm"
                    >
                      {loading ? `جارِ ${confirmText}...` : confirmText}
                    </Button>
                  </div>
                </ModalFooter>
              )}
            </motion.div>
          )}
        </ModalContent>
      </Modal>
    </AnimatePresence>
  );
}