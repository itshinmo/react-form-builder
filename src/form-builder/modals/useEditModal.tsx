import * as React from "react";
import EditModal from "../components/EditModal";
import type { FormItem } from "../types";
import type { ModalController } from "./types";
import useModalState from "./useModalState";

const useEditModal = (): ModalController => {
  const modal = useModalState<FormItem>();

  const render = React.useCallback(() => {
    if (!modal.item) return null;

    return (
      <EditModal
        key={`edit-${modal.item.id}`}
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

export default useEditModal;
