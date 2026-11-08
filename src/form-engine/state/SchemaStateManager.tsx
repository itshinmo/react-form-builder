import * as React from "react";
import { useFormContext } from "react-hook-form";
import { useSchema } from "../schema-provider";
import { getVisibleFieldData, getVisibleWidgetIds } from "../schema/effects";
import type { DocumentSchema, FieldData, SchemaId } from "../schema/types";
import {
  createNavigateAction,
  createResetAction,
  createSetPageDataAction,
  createSetVisibleWidgetsAction,
  createSyncPageAction,
} from "./actions";
import { SchemaStateManagerProvider, type ContextValue } from "./context";
import reducer, { INITIAL_STATE, type State } from "./reducer";

type Props = {
  children: React.ReactNode;
};

const getPageWidgetIds = (
  schema: DocumentSchema | null,
  pageId: SchemaId,
): SchemaId[] => schema?.definitions.pages[pageId]?.widgetIds ?? [];

const createInitialState = (
  schema: DocumentSchema | null,
  fieldData: FieldData,
): State => {
  const pageId = schema?.pageIds[0] ?? "";
  const pageWidgetIds = getPageWidgetIds(schema, pageId);

  return {
    ...INITIAL_STATE,
    currentPage: pageId,
    currentPageWidgets: pageWidgetIds,
    visibleWidgets: schema
      ? getVisibleWidgetIds(schema, pageId, fieldData)
      : [],
  };
};

/**
 * Holds the runtime state of a form: the current page, visited pages, page
 * values and the widgets currently visible on the page.
 */
const SchemaStateManager = (props: Props) => {
  const { children } = props;

  const { getValues, unregister } = useFormContext();
  const schema = useSchema();

  const [state, dispatch] = React.useReducer(reducer, undefined, () =>
    createInitialState(schema, getValues() as FieldData),
  );

  /**
   * Keep the manager in sync when the schema is edited in the builder (or a
   * different schema is passed to the same form). Values are intentionally
   * kept as long as the current page still exists.
   */
  React.useEffect(() => {
    if (!schema) return;

    const pageId = schema.pageIds.includes(state.currentPage)
      ? state.currentPage
      : schema.pageIds[0] ?? "";

    const pageWidgetIds = getPageWidgetIds(schema, pageId);
    const visibleWidgetIds = pageId
      ? getVisibleWidgetIds(schema, pageId, getValues() as FieldData)
      : [];

    dispatch(
      createSyncPageAction(
        pageId,
        pageWidgetIds,
        visibleWidgetIds,
        schema.pageIds,
      ),
    );
  }, [getValues, schema, state.currentPage]);

  /**
   * Hidden widgets must not keep required validation rules registered, or a
   * hidden required field could block submitting an otherwise valid form.
   * Their values are saved to page data first so they can be restored if the
   * widget becomes visible again.
   */
  React.useEffect(() => {
    if (!schema?.definitions.pages[state.currentPage]) return;

    const hiddenWidgetIds = state.currentPageWidgets.filter(
      widgetId => !state.visibleWidgets.includes(widgetId),
    );

    if (hiddenWidgetIds.length === 0) return;

    dispatch(
      createSetPageDataAction(
        state.currentPage,
        getVisibleFieldData(getValues() as FieldData, state.currentPageWidgets),
      ),
    );

    hiddenWidgetIds.forEach(widgetId => unregister(widgetId));
  }, [
    getValues,
    schema,
    state.currentPage,
    state.currentPageWidgets,
    state.visibleWidgets,
    unregister,
  ]);

  const goToPage = React.useCallback(
    (pageId: SchemaId, isBack = false) => {
      if (!schema) return;

      const page = schema.definitions.pages[pageId];
      if (!page) return;

      const fieldData = getValues() as FieldData;

      dispatch(
        createNavigateAction(
          pageId,
          page.widgetIds,
          getVisibleWidgetIds(schema, pageId, fieldData),
          isBack,
        ),
      );
    },
    [getValues, schema],
  );

  const setPageData = React.useCallback((pageId: SchemaId, data: FieldData) => {
    dispatch(createSetPageDataAction(pageId, data));
  }, []);

  const setVisibleWidgets = React.useCallback((widgetIds: SchemaId[]) => {
    dispatch(createSetVisibleWidgetsAction(widgetIds));
  }, []);

  const reset = React.useCallback(() => {
    if (!schema) return;

    const pageId = schema.pageIds[0] ?? "";
    const fieldData = getValues() as FieldData;

    dispatch(
      createResetAction(
        pageId,
        getPageWidgetIds(schema, pageId),
        pageId ? getVisibleWidgetIds(schema, pageId, fieldData) : [],
      ),
    );
  }, [getValues, schema]);

  const contextValue = React.useMemo<ContextValue>(
    () => ({
      state,
      goToPage,
      setPageData,
      setVisibleWidgets,
      reset,
    }),
    [goToPage, reset, setPageData, setVisibleWidgets, state],
  );

  if (!schema) return null;

  return (
    <SchemaStateManagerProvider value={contextValue}>
      {children}
    </SchemaStateManagerProvider>
  );
};

export default SchemaStateManager;
