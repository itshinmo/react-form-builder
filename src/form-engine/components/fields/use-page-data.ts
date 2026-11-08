import { useSchemaStateManager } from "../../state";
import type { SchemaId } from "../../schema/types";

/**
 * Returns the stored value for a widget on the current page or `fallback` when
 * the widget has no value yet.
 */
const usePageData = <T>(widgetId: SchemaId, fallback: T): T => {
  const stateManager = useSchemaStateManager();

  if (!stateManager) return fallback;

  const { state } = stateManager;
  const pageData = state.pageData[state.currentPage];

  if (!pageData) return fallback;

  return (pageData[widgetId] as T | undefined) ?? fallback;
};

export default usePageData;
