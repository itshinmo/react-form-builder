import type { FieldData, SchemaId } from "../schema/types";
import { ActionType, type Action } from "./actions";

export type State = {
  visitedPages: SchemaId[];
  pageData: Record<SchemaId, FieldData>;
  currentPage: SchemaId;
  visibleWidgets: SchemaId[];
  currentPageWidgets: SchemaId[];
};

export const INITIAL_STATE: State = {
  visitedPages: [],
  pageData: {},
  currentPage: "",
  visibleWidgets: [],
  currentPageWidgets: [],
};

const isSameIdList = (a: SchemaId[], b: SchemaId[]): boolean =>
  a.length === b.length && a.every((id, index) => id === b[index]);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.NAVIGATE: {
      const { pageId, isBack, pageWidgetIds, visibleWidgetIds } =
        action.payload;

      const visitedPages = isBack
        ? state.visitedPages.slice(0, -1)
        : state.visitedPages.includes(state.currentPage)
        ? state.visitedPages
        : state.currentPage
        ? [...state.visitedPages, state.currentPage]
        : state.visitedPages;

      return {
        ...state,
        currentPage: pageId,
        currentPageWidgets: pageWidgetIds,
        visibleWidgets: visibleWidgetIds,
        visitedPages,
      };
    }

    case ActionType.SET_VISIBLE_WIDGETS: {
      const { widgetIds } = action.payload;

      if (isSameIdList(state.visibleWidgets, widgetIds)) return state;

      return { ...state, visibleWidgets: widgetIds };
    }

    case ActionType.SET_PAGE_DATA: {
      const { pageId, data } = action.payload;

      return {
        ...state,
        pageData: {
          ...state.pageData,
          [pageId]: { ...state.pageData[pageId], ...data },
        },
      };
    }

    case ActionType.SYNC_PAGE: {
      const { pageId, pageWidgetIds, visibleWidgetIds, validPageIds } =
        action.payload;

      const validPageIdSet = new Set(validPageIds);
      const visitedPages = state.visitedPages.filter(
        id => id !== pageId && validPageIdSet.has(id),
      );

      if (
        state.currentPage === pageId &&
        isSameIdList(state.currentPageWidgets, pageWidgetIds) &&
        isSameIdList(state.visibleWidgets, visibleWidgetIds) &&
        isSameIdList(state.visitedPages, visitedPages)
      ) {
        return state;
      }

      return {
        ...state,
        currentPage: pageId,
        currentPageWidgets: pageWidgetIds,
        visibleWidgets: visibleWidgetIds,
        visitedPages,
      };
    }

    case ActionType.RESET: {
      const { pageId, pageWidgetIds, visibleWidgetIds } = action.payload;

      return {
        visitedPages: [],
        pageData: {},
        currentPage: pageId,
        currentPageWidgets: pageWidgetIds,
        visibleWidgets: visibleWidgetIds,
      };
    }

    default:
      return state;
  }
};

export default reducer;
