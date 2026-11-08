import type { Effect, SchemaId, WidgetDefinition } from "form-engine";
import type { PageNode, WidgetNode } from "../types";

export enum ActionType {
  ADD_PAGE = "ADD_PAGE",
  ADD_WIDGET = "ADD_WIDGET",
  REMOVE_PAGE = "REMOVE_PAGE",
  REMOVE_WIDGET = "REMOVE_WIDGET",
  EDIT_PAGE = "EDIT_PAGE",
  EDIT_WIDGET = "EDIT_WIDGET",
}

export type Action =
  | {
      type: ActionType.ADD_PAGE;
      payload: { page: PageNode };
    }
  | {
      type: ActionType.ADD_WIDGET;
      payload: { widget: WidgetNode };
    }
  | {
      type: ActionType.REMOVE_PAGE;
      payload: { pageId: SchemaId };
    }
  | {
      type: ActionType.REMOVE_WIDGET;
      payload: { widgetId: SchemaId };
    }
  | {
      type: ActionType.EDIT_WIDGET;
      payload: {
        widgetId: SchemaId;
        definition: WidgetDefinition;
      };
    }
  | {
      type: ActionType.EDIT_PAGE;
      payload: {
        pageId: SchemaId;
        title: string;
        effects?: Effect[];
      };
    };

export const createAddPageAction = (page: PageNode): Action => ({
  type: ActionType.ADD_PAGE,
  payload: { page },
});

export const createAddWidgetAction = (widget: WidgetNode): Action => ({
  type: ActionType.ADD_WIDGET,
  payload: { widget },
});

export const createRemovePageAction = (pageId: SchemaId): Action => ({
  type: ActionType.REMOVE_PAGE,
  payload: { pageId },
});

export const createRemoveWidgetAction = (widgetId: SchemaId): Action => ({
  type: ActionType.REMOVE_WIDGET,
  payload: { widgetId },
});

export const createEditWidgetAction = (
  widgetId: SchemaId,
  definition: WidgetDefinition,
): Action => ({
  type: ActionType.EDIT_WIDGET,
  payload: { widgetId, definition },
});

export const createEditPageAction = (
  pageId: SchemaId,
  title: string,
  effects?: Effect[],
): Action => ({
  type: ActionType.EDIT_PAGE,
  payload: { pageId, title, effects },
});
