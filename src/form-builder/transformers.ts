import type { FieldValues } from "react-hook-form";
import type {
  ChoiceOption,
  Effect,
  WidgetDefinition,
  WidgetType,
} from "form-engine";
import {
  getEffectsFromFormValues,
  generateId,
} from "./components/effects/utils";
import * as names from "./names";
import { PAGE_IDENTIFIER, WIDGET_IDENTIFIER, WIDGET_TYPE } from "./names";
import type { PageNode, WidgetNode } from "./types";

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value !== "string" || value.trim() === "") return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const toString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const toOptionalString = (value: unknown): string | undefined => {
  const formatted = toString(value);

  return formatted === "" ? undefined : formatted;
};

const toChoiceDefaultValue = (
  value: unknown,
): string | string[] | undefined => {
  if (typeof value === "string") return value === "" ? undefined : value;

  if (Array.isArray(value)) {
    return value.length === 0 ? undefined : (value as string[]);
  }

  return undefined;
};

export const createNewPage = (data: FieldValues): PageNode => ({
  id: `${PAGE_IDENTIFIER}${generateId()}`,
  type: "page",
  title: toString(data[names.TITLE]),
  widgetIds: [],
  effectIds: [],
});

export const createWidgetDefinition = (
  data: FieldValues,
  widgetType: WidgetType,
): WidgetDefinition => {
  const label = toString(data[names.LABEL]);
  const description = toOptionalString(data[names.DESCRIPTION]);
  const placeholder = toOptionalString(data[names.PLACEHOLDER]);
  const required = Boolean(data[names.REQUIRED]);

  switch (widgetType) {
    case "string":
      return {
        kind: "field",
        type: "string",
        label,
        description,
        placeholder,
        required,
        inputType:
          (data[names.INPUT_TYPE] as "text" | "email" | undefined) ?? "text",
        multiline: Boolean(data[names.MULTILINE]),
        maxLength: toNumber(data[names.MAX_LENGTH]),
        minLength: toNumber(data[names.MIN_LENGTH]),
        defaultValue: toOptionalString(data[names.DEFAULT_VALUE]),
      };

    case "number":
      return {
        kind: "field",
        type: "number",
        label,
        description,
        placeholder,
        required,
        max: toNumber(data[names.MAX]),
        min: toNumber(data[names.MIN]),
        defaultValue: toNumber(data[names.DEFAULT_VALUE]),
      };

    case "boolean":
      return {
        kind: "field",
        type: "boolean",
        label,
        description,
        required,
        defaultChecked: Boolean(data[names.DEFAULT_CHECKED]),
      };

    case "choice":
      return {
        kind: "field",
        type: "choice",
        label,
        description,
        required,
        multiSelect: Boolean(data[names.MULTISELECT]),
        shuffleOptions: Boolean(data[names.SHUFFLE_OPTIONS]),
        options: (data[names.OPTIONS] as ChoiceOption[] | undefined) ?? [],
        minRequired: toNumber(data[names.MIN_REQUIRED]),
        maxRequired: toNumber(data[names.MAX_REQUIRED]),
        defaultValue: toChoiceDefaultValue(data[names.DEFAULT_VALUE]),
      };

    case "text":
      return {
        kind: "ui",
        type: "text",
        label,
        text: toString(data[names.TEXT]),
        variant:
          (data[names.VARIANT] as "paragraph" | "title" | "subtitle") ??
          "paragraph",
      };

    case "link":
      return {
        kind: "ui",
        type: "link",
        label,
        text: toString(data[names.TEXT]),
        href: toString(data[names.HREF]),
      };

    case "divider":
      return { kind: "ui", type: "divider", label };

    default:
      throw new Error(`Unsupported widget type: ${String(widgetType)}`);
  }
};

export const createNewWidget = (
  data: FieldValues,
  pageId: string,
): WidgetNode => {
  const widgetType = data[WIDGET_TYPE] as WidgetType;
  const definition = createWidgetDefinition(data, widgetType);

  return {
    ...definition,
    id: `${WIDGET_IDENTIFIER}${generateId()}`,
    pageId,
  } as WidgetNode;
};

export const createEditPageProps = (
  data: FieldValues,
  page: PageNode,
): { title: string; effects: Effect[] } => ({
  title: toString(data[names.TITLE]),
  effects: getEffectsFromFormValues(page.id, data),
});
