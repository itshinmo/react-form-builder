import * as React from "react";
import type { CreateFormData } from "../types";
import {
  createAddPageAction,
  createAddWidgetAction,
  createEditPageAction,
  createEditWidgetAction,
  createRemovePageAction,
  createRemoveWidgetAction,
} from "./actions";
import { FormStateManagerProvider, type ContextValue } from "./context";
import reducer from "./reducer";

type Props = {
  formData: CreateFormData;
  children: React.ReactNode;
};

const FormStateManager = (props: Props) => {
  const { children, formData } = props;

  const [state, dispatch] = React.useReducer(reducer, formData);

  const addActions = React.useMemo<ContextValue["addActions"]>(
    () => ({
      addPage: page => dispatch(createAddPageAction(page)),
      addWidget: widget => dispatch(createAddWidgetAction(widget)),
    }),
    [],
  );

  const removeActions = React.useMemo<ContextValue["removeActions"]>(
    () => ({
      removePage: pageId => dispatch(createRemovePageAction(pageId)),
      removeWidget: widgetId => dispatch(createRemoveWidgetAction(widgetId)),
    }),
    [],
  );

  const editActions = React.useMemo<ContextValue["editActions"]>(
    () => ({
      editWidget: (widgetId, definition) =>
        dispatch(createEditWidgetAction(widgetId, definition)),
      editPage: (pageId, title, effects) =>
        dispatch(createEditPageAction(pageId, title, effects)),
    }),
    [],
  );

  const contextValue = React.useMemo<ContextValue>(
    () => ({
      state,
      addActions,
      removeActions,
      editActions,
    }),
    [addActions, editActions, removeActions, state],
  );

  return (
    <FormStateManagerProvider value={contextValue}>
      {children}
    </FormStateManagerProvider>
  );
};

export default FormStateManager;
