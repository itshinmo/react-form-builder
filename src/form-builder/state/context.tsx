import * as React from "react";
import type { Effect, SchemaId, WidgetDefinition } from "form-engine";
import type { PageNode, WidgetNode } from "../types";
import type { State } from "./reducer";

type AddActions = {
  addPage: (page: PageNode) => void;
  addWidget: (widget: WidgetNode) => void;
};

type RemoveActions = {
  removePage: (pageId: SchemaId) => void;
  removeWidget: (widgetId: SchemaId) => void;
};

type EditActions = {
  editWidget: (widgetId: SchemaId, definition: WidgetDefinition) => void;
  editPage: (pageId: SchemaId, title: string, effects?: Effect[]) => void;
};

export type ContextValue = {
  state: State;
  addActions: AddActions;
  removeActions: RemoveActions;
  editActions: EditActions;
};

const Context = React.createContext<ContextValue | null>(null);

if (import.meta.env.DEV) {
  Context.displayName = "FormStateManagerContext";
}

type ProviderProps = {
  children: React.ReactNode;
  value: ContextValue;
};

export const FormStateManagerProvider = (props: ProviderProps) => {
  const { children, value } = props;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useFormStateManager = () => React.useContext(Context);
