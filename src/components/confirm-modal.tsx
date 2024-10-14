import {
  Dialog,
  DialogTitle,
  Description,
  DialogPanel,
} from "@headlessui/react";
import Button from "./button";
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="bg-white/60 fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <DialogPanel className="relative bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <Description className="text-gray-700 my-4">{message}</Description>

          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmModal;
