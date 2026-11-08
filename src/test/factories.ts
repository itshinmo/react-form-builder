import {
  ComparisonType,
  FieldActionType,
  PageActionType,
  type DocumentSchema,
  type Effect,
  type FieldEffect,
  type PageEffect,
  type PageSchema,
  type StringFieldWidget,
  type Widget,
} from "form-engine";
import type { CreateFormData, PageNode } from "form-builder/types";

export const createPage = (
  id: string,
  overrides: Partial<PageNode> = {},
): PageNode => ({
  id,
  type: "page",
  title: `Page ${id}`,
  widgetIds: [],
  effectIds: [],
  ...overrides,
});

export const createStringWidget = (
  id: string,
  pageId: string,
  overrides: Partial<StringFieldWidget> = {},
): StringFieldWidget => ({
  id,
  pageId,
  kind: "field",
  type: "string",
  label: `Widget ${id}`,
  inputType: "text",
  ...overrides,
});

export const createFieldEffect = (
  id: string,
  owner: string,
  options: {
    fieldId?: string;
    value?: unknown;
    widgetIds?: string[];
  } = {},
): FieldEffect => {
  const {
    fieldId = "WIDGET_1",
    value = "yes",
    widgetIds = ["WIDGET_2"],
  } = options;

  return {
    id,
    owner,
    type: "field",
    fn: { type: ComparisonType.EQ, fieldId, value },
    action: { type: FieldActionType.HIDE_WIDGETS, widgetIds },
  };
};

export const createPageEffect = (
  id: string,
  owner: string,
  options: {
    fieldId?: string;
    value?: unknown;
    targetPageId?: string;
  } = {},
): PageEffect => {
  const {
    fieldId = "WIDGET_1",
    value = "yes",
    targetPageId = "PAGE_2",
  } = options;

  return {
    id,
    owner,
    type: "page",
    fn: { type: ComparisonType.EQ, fieldId, value },
    action: { type: PageActionType.GO_TO_PAGE, pageId: targetPageId },
  };
};

export const createDocumentSchema = (options: {
  pageIds: string[];
  pages: Record<string, PageSchema>;
  widgets?: Record<string, Widget>;
  effects?: Record<string, Effect>;
  submitButtonText?: string;
}): DocumentSchema => ({
  pageIds: options.pageIds,
  submitButtonText: options.submitButtonText ?? "Submit",
  definitions: {
    pages: options.pages,
    widgets: options.widgets ?? {},
    effects: options.effects ?? {},
  },
});

export const createBuilderState = (options: {
  pages: PageNode[];
  widgets?: Widget[];
  effects?: Effect[];
}): CreateFormData => ({
  pages: {
    allIds: options.pages.map(page => page.id),
    byId: Object.fromEntries(options.pages.map(page => [page.id, page])),
  },
  widgets: {
    allIds: (options.widgets ?? []).map(widget => widget.id),
    byId: Object.fromEntries(
      (options.widgets ?? []).map(widget => [widget.id, widget]),
    ),
  },
  effects: {
    allIds: (options.effects ?? []).map(effect => effect.id),
    byId: Object.fromEntries(
      (options.effects ?? []).map(effect => [effect.id, effect]),
    ),
  },
});
