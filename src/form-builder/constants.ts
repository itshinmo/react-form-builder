import {
  ComparisonType,
  FieldActionType,
  LogicalType,
  PageActionType,
} from "form-engine/schema/constants";
import type { ChoiceOption, EffectType } from "form-engine/schema/types";

export const COMPARISON_OPERATOR_LABELS: Record<ComparisonType, string> = {
  [ComparisonType.EQ]: "Equals to",
  [ComparisonType.NEQ]: "Not equal to",
  [ComparisonType.GT]: "Greater than",
  [ComparisonType.LT]: "Less than",
  [ComparisonType.IN]: "Contains",
  [ComparisonType.NIN]: "Does not contain",
  [ComparisonType.GTE]: "Greater than or equal to",
  [ComparisonType.LTE]: "Less than or equal to",
};

export const LOGICAL_OPERATOR_LABELS: Record<LogicalType, string> = {
  [LogicalType.AND]: "And",
  [LogicalType.OR]: "Or",
};

export const PAGE_ACTION_LABELS: Record<PageActionType, string> = {
  [PageActionType.GO_TO_PAGE]: "Go to page",
};

export const FIELD_ACTION_LABELS: Record<FieldActionType, string> = {
  [FieldActionType.HIDE_WIDGETS]: "Hide widgets",
};

export const toChoiceOptions = <T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): ChoiceOption[] => values.map(value => ({ value, label: labels[value] }));

export const comparisonOperators = toChoiceOptions(
  Object.values(ComparisonType),
  COMPARISON_OPERATOR_LABELS,
);

export const logicalOperators = toChoiceOptions(
  Object.values(LogicalType),
  LOGICAL_OPERATOR_LABELS,
);

export const pageEffectActions = toChoiceOptions(
  Object.values(PageActionType),
  PAGE_ACTION_LABELS,
);

export const fieldEffectActions = toChoiceOptions(
  Object.values(FieldActionType),
  FIELD_ACTION_LABELS,
);

export const effectTypeOptions: ChoiceOption[] = [
  { label: "Field effect", value: "field" satisfies EffectType },
  { label: "Page effect", value: "page" satisfies EffectType },
];

export const stringInputTypeOptions: ChoiceOption[] = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
];

export const textVariantOptions: ChoiceOption[] = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Title", value: "title" },
  { label: "Subtitle", value: "subtitle" },
];
