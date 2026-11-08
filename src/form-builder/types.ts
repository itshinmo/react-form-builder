import type { Effect, PageSchema, SchemaId, Widget } from "form-engine";
import type { FieldWidget } from "form-engine/schema/types";

export type PageNode = PageSchema & {
  type: "page";
};

export type WidgetNode = Widget;
export type FieldWidgetNode = FieldWidget;

export type FormItem = PageNode | WidgetNode;

export type TabName = "effects" | "settings";

export type TabState = {
  name: TabName;
  icon: JSX.Element;
  tabContent: JSX.Element;
};

export type CreateFormData = {
  pages: {
    byId: Record<SchemaId, PageNode>;
    allIds: SchemaId[];
  };
  widgets: {
    byId: Record<SchemaId, WidgetNode>;
    allIds: SchemaId[];
  };
  effects: {
    byId: Record<SchemaId, Effect>;
    allIds: SchemaId[];
  };
};

export const EMPTY_FORM_DATA: CreateFormData = {
  pages: { byId: {}, allIds: [] },
  widgets: { byId: {}, allIds: [] },
  effects: { byId: {}, allIds: [] },
};
