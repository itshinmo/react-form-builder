import type { FieldData, SchemaId } from "../schema/types";

export enum ActionType {
  NAVIGATE = "NAVIGATE",
  SET_PAGE_DATA = "SET_PAGE_DATA",
  SET_VISIBLE_WIDGETS = "SET_VISIBLE_WIDGETS",
  SYNC_PAGE = "SYNC_PAGE",
  RESET = "RESET",
}

export type Action =
  | {
      type: ActionType.NAVIGATE;
      payload: {
        pageId: SchemaId;
        isBack: boolean;
        pageWidgetIds: SchemaId[];
        visibleWidgetIds: SchemaId[];
      };
    }
  | {
      type: ActionType.SET_PAGE_DATA;
      payload: { pageId: SchemaId; data: FieldData };
    }
  | {
      type: ActionType.SET_VISIBLE_WIDGETS;
      payload: { widgetIds: SchemaId[] };
    }
  | {
      type: ActionType.SYNC_PAGE;
      payload: {
        pageId: SchemaId;
        pageWidgetIds: SchemaId[];
        visibleWidgetIds: SchemaId[];
        validPageIds: SchemaId[];
      };
    }
  | {
      type: ActionType.RESET;
      payload: {
        pageId: SchemaId;
        pageWidgetIds: SchemaId[];
        visibleWidgetIds: SchemaId[];
      };
    };

export const createNavigateAction = (
  pageId: SchemaId,
  pageWidgetIds: SchemaId[],
  visibleWidgetIds: SchemaId[],
  isBack = false,
): Action => ({
  type: ActionType.NAVIGATE,
  payload: { pageId, pageWidgetIds, visibleWidgetIds, isBack },
});

export const createSetPageDataAction = (
  pageId: SchemaId,
  data: FieldData,
): Action => ({
  type: ActionType.SET_PAGE_DATA,
  payload: { pageId, data },
});

export const createSetVisibleWidgetsAction = (
  widgetIds: SchemaId[],
): Action => ({
  type: ActionType.SET_VISIBLE_WIDGETS,
  payload: { widgetIds },
});

export const createSyncPageAction = (
  pageId: SchemaId,
  pageWidgetIds: SchemaId[],
  visibleWidgetIds: SchemaId[],
  validPageIds: SchemaId[],
): Action => ({
  type: ActionType.SYNC_PAGE,
  payload: { pageId, pageWidgetIds, visibleWidgetIds, validPageIds },
});

export const createResetAction = (
  pageId: SchemaId,
  pageWidgetIds: SchemaId[],
  visibleWidgetIds: SchemaId[],
): Action => ({
  type: ActionType.RESET,
  payload: { pageId, pageWidgetIds, visibleWidgetIds },
});
