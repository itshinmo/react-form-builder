import * as React from "react";
import type { AddModalController, ModalController } from "./types";

type ContextValue = {
  deleteModal: ModalController;
  editModal: ModalController;
  addModal: AddModalController;
};

const Context = React.createContext<ContextValue | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  deleteModal: ModalController;
  editModal: ModalController;
  addModal: AddModalController;
};

export const ModalManagerProvider = (props: ProviderProps) => {
  const { children, deleteModal, editModal, addModal } = props;

  const value = React.useMemo(
    () => ({ deleteModal, editModal, addModal }),
    [addModal, deleteModal, editModal],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useModalManager = () => React.useContext(Context);
