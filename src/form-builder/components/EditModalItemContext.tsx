import * as React from "react";
import type { FormItem } from "../types";

const Context = React.createContext<FormItem | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  item: FormItem;
};

export const EditModalItemProvider = (props: ProviderProps) => {
  const { children, item } = props;

  return <Context.Provider value={item}>{children}</Context.Provider>;
};

export const useEditModalItem = () => React.useContext(Context);
