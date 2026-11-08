import * as React from "react";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import type { FormItem } from "../types";
import type { ModalController } from "./types";
import useModalState from "./useModalState";

const useDeleteModal = (): ModalController => {
  const modal = useModalState<FormItem>();

  const render = React.useCallback(() => {
    if (!modal.item) return null;

    return (
      <DeleteConfirmationModal
        key={`delete-${modal.item.id}`}
        item={modal.item}
        open={modal.isOpen}
        onClose={modal.close}
        onCloseFinish={modal.clear}
      />
    );
  }, [modal.clear, modal.close, modal.isOpen, modal.item]);

  return {
    open: modal.open,
    close: modal.close,
    render,
  };
};

export default useDeleteModal;
