import type { ChoiceOption } from "./types";

export enum ComparisonType {
  EQ = "EQ",
  NEQ = "NEQ",
  GT = "GT",
  LT = "LT",
  IN = "IN",
  NIN = "NIN",
  GTE = "GTE",
  LTE = "LTE",
}

export enum LogicalType {
  AND = "AND",
  OR = "OR",
}

export enum FieldActionType {
  HIDE_WIDGETS = "HIDE_WIDGETS",
}

export enum PageActionType {
  GO_TO_PAGE = "GO_TO_PAGE",
}

export const FIELD_WIDGET_TYPE_OPTIONS: ChoiceOption[] = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Choice", value: "choice" },
  { label: "Boolean", value: "boolean" },
];

export const UI_WIDGET_TYPE_OPTIONS: ChoiceOption[] = [
  { label: "Text", value: "text" },
  { label: "Link", value: "link" },
  { label: "Divider", value: "divider" },
];

export const WIDGET_KIND_OPTIONS: ChoiceOption[] = [
  { label: "Field", value: "field" },
  { label: "UI", value: "ui" },
];
