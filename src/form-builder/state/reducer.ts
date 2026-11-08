import { produce, type Draft } from "immer";
import {
  isAlwaysFn,
  isLogicalFn,
  type Effect,
  type Fn,
  type SchemaId,
} from "form-engine";
import type { CreateFormData, WidgetNode } from "../types";
import { ActionType, type Action } from "./actions";

export type State = CreateFormData;

const fnReferencesWidget = (fn: Fn, widgetId: SchemaId): boolean => {
  if (isAlwaysFn(fn)) return false;

  if (isLogicalFn(fn)) {
    return fn.operands.some(operand => fnReferencesWidget(operand, widgetId));
  }

  return fn.fieldId === widgetId;
};

/**
 * Removes effects that are no longer valid after pages/widgets changed.
 * This covers effects owned by other pages too, which was previously missed.
 */
const pruneEffects = (
  draft: Draft<State>,
  isOrphaned: (effect: Effect) => boolean,
): void => {
  for (const effectId of [...draft.effects.allIds]) {
    const effect = draft.effects.byId[effectId];

    if (!effect) continue;

    if (isOrphaned(effect)) {
      delete draft.effects.byId[effectId];
      draft.effects.allIds = draft.effects.allIds.filter(id => id !== effectId);
    }
  }

  for (const page of Object.values(draft.pages.byId)) {
    page.effectIds = page.effectIds.filter(
      effectId => draft.effects.byId[effectId] !== undefined,
    );
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_PAGE: {
      const { page } = action.payload;

      if (state.pages.byId[page.id]) return state;

      return produce(state, draft => {
        draft.pages.byId[page.id] = page;
        draft.pages.allIds.push(page.id);
      });
    }

    case ActionType.ADD_WIDGET: {
      const { widget } = action.payload;
      const page = state.pages.byId[widget.pageId];

      if (!page || state.widgets.byId[widget.id]) return state;

      return produce(state, draft => {
        draft.widgets.byId[widget.id] = widget;
        draft.widgets.allIds.push(widget.id);
        draft.pages.byId[widget.pageId]?.widgetIds.push(widget.id);
      });
    }

    case ActionType.REMOVE_PAGE: {
      const { pageId } = action.payload;
      const page = state.pages.byId[pageId];

      if (!page) return state;

      const deletedWidgetIds = new Set(page.widgetIds);

      return produce(state, draft => {
        for (const widgetId of page.widgetIds) {
          delete draft.widgets.byId[widgetId];
        }
        draft.widgets.allIds = draft.widgets.allIds.filter(
          widgetId => !deletedWidgetIds.has(widgetId),
        );

        delete draft.pages.byId[pageId];
        draft.pages.allIds = draft.pages.allIds.filter(id => id !== pageId);

        pruneEffects(draft, effect => {
          if (effect.owner === pageId) return true;

          for (const widgetId of deletedWidgetIds) {
            if (fnReferencesWidget(effect.fn, widgetId)) return true;
          }

          if (effect.type === "page") {
            return effect.action.pageId === pageId;
          }

          effect.action.widgetIds = effect.action.widgetIds.filter(
            widgetId => !deletedWidgetIds.has(widgetId),
          );

          return effect.action.widgetIds.length === 0;
        });
      });
    }

    case ActionType.REMOVE_WIDGET: {
      const { widgetId } = action.payload;
      const widget = state.widgets.byId[widgetId];

      if (!widget) return state;

      return produce(state, draft => {
        const page = draft.pages.byId[widget.pageId];
        if (page) {
          page.widgetIds = page.widgetIds.filter(id => id !== widgetId);
        }

        delete draft.widgets.byId[widgetId];
        draft.widgets.allIds = draft.widgets.allIds.filter(
          id => id !== widgetId,
        );

        pruneEffects(draft, effect => {
          if (fnReferencesWidget(effect.fn, widgetId)) return true;

          if (effect.type === "field") {
            effect.action.widgetIds = effect.action.widgetIds.filter(
              id => id !== widgetId,
            );

            return effect.action.widgetIds.length === 0;
          }

          return false;
        });
      });
    }

    case ActionType.EDIT_WIDGET: {
      const { widgetId, definition } = action.payload;
      const widget = state.widgets.byId[widgetId];

      if (!widget) return state;

      return produce(state, draft => {
        draft.widgets.byId[widgetId] = {
          ...definition,
          id: widget.id,
          pageId: widget.pageId,
        } as WidgetNode;
      });
    }

    case ActionType.EDIT_PAGE: {
      const { pageId, title, effects = [] } = action.payload;
      const page = state.pages.byId[pageId];

      if (!page) return state;

      return produce(state, draft => {
        const draftPage = draft.pages.byId[pageId];
        if (!draftPage) return;

        const oldEffectIds = new Set(page.effectIds);

        draftPage.title = title.trim();
        draftPage.effectIds = [];

        for (const effectId of oldEffectIds) {
          delete draft.effects.byId[effectId];
        }

        draft.effects.allIds = draft.effects.allIds.filter(
          effectId => !oldEffectIds.has(effectId),
        );

        const newEffectIds: SchemaId[] = [];

        for (const effect of effects) {
          const effectWithOwner: Effect = { ...effect, owner: pageId };

          draft.effects.byId[effect.id] = effectWithOwner;

          if (!draft.effects.allIds.includes(effect.id)) {
            draft.effects.allIds.push(effect.id);
          }

          newEffectIds.push(effect.id);
        }

        draftPage.effectIds = newEffectIds;
      });
    }

    default:
      return state;
  }
};

export default reducer;
