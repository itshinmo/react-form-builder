import * as React from "react";
import AddModal from "../components/AddModal";
import type { AddModalController, AddTarget } from "./types";
import useModalState from "./useModalState";

const useAddModal = (): AddModalController => {
  const modal = useModalState<AddTarget>();

  const render = React.useCallback(() => {
    if (!modal.item) return null;

    const key =
      modal.item.type === "page"
        ? "add-page"
        : `add-widget-${modal.item.parent.id}`;

    return (
      <AddModal
        key={key}
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

export default useAddModal;
