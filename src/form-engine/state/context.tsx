import * as React from "react";
import type { FieldData, SchemaId } from "../schema/types";
import type { State } from "./reducer";

export type ContextValue = {
  state: State;
  goToPage: (pageId: SchemaId, isBack?: boolean) => void;
  setPageData: (pageId: SchemaId, data: FieldData) => void;
  setVisibleWidgets: (widgetIds: SchemaId[]) => void;
  reset: () => void;
};

const Context = React.createContext<ContextValue | null>(null);

if (import.meta.env.DEV) {
  Context.displayName = "SchemaStateManagerContext";
}

type ProviderProps = {
  children: React.ReactNode;
  value: ContextValue;
};

export const SchemaStateManagerProvider = (props: ProviderProps) => {
  const { children, value } = props;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSchemaStateManager = () => React.useContext(Context);
