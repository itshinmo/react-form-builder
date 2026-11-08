import { nanoid } from "nanoid";
import type { FieldValues } from "react-hook-form";
import {
  FieldActionType,
  isLogicalFn,
  LogicalType,
  PageActionType,
  type ComparisonFn,
  type ComparisonType,
  type Effect,
  type FieldEffect,
  type Fn,
  type LogicalFn,
  type PageEffect,
  type SchemaId,
} from "form-engine";
import {
  ACTION_PAYLOAD,
  ACTION_TYPE,
  EFFECT_NAME_SEPARATOR,
  EFFECT_TYPE,
  FIELD_ID,
  FIRST_COMPARISON_FN_IDENTIFIER,
  LOGICAL_FN_IDENTIFIER,
  OPERATOR,
  SECOND_COMPARISON_FN_IDENTIFIER,
  VALUE,
} from "../../names";
import type { EffectFormFieldName } from "./types";

export const generateId = (): string => nanoid();

export const createEffectNameGenerator =
  (effectId: SchemaId, fnId?: SchemaId) =>
  (fieldName: EffectFormFieldName): string =>
    fnId
      ? `${effectId}${EFFECT_NAME_SEPARATOR}${fnId}${EFFECT_NAME_SEPARATOR}${fieldName}`
      : `${effectId}${EFFECT_NAME_SEPARATOR}${fieldName}`;

const getComparisonFieldNames = (effectId: SchemaId, fnId: SchemaId) => {
  const generateName = createEffectNameGenerator(effectId, fnId);

  return {
    operator: generateName(OPERATOR),
    fieldId: generateName(FIELD_ID),
    value: generateName(VALUE),
  };
};

export const generateFnFieldValues = (
  fn: Fn,
  effectId: SchemaId,
): Record<string, unknown> => {
  if (isLogicalFn(fn)) {
    const logicalNames = createEffectNameGenerator(
      effectId,
      LOGICAL_FN_IDENTIFIER,
    );
    const firstNames = getComparisonFieldNames(
      effectId,
      FIRST_COMPARISON_FN_IDENTIFIER,
    );
    const secondNames = getComparisonFieldNames(
      effectId,
      SECOND_COMPARISON_FN_IDENTIFIER,
    );

    const [first, second] = fn.operands;

    return {
      [logicalNames(OPERATOR)]: fn.type,
      [firstNames.operator]: first.type,
      [firstNames.fieldId]: first.fieldId,
      [firstNames.value]: first.value,
      [secondNames.operator]: second.type,
      [secondNames.fieldId]: second.fieldId,
      [secondNames.value]: second.value,
    };
  }

  const names = getComparisonFieldNames(
    effectId,
    FIRST_COMPARISON_FN_IDENTIFIER,
  );

  return {
    [names.operator]: fn.type,
    [names.fieldId]: fn.fieldId,
    [names.value]: fn.value,
  };
};

export const generateEffectFieldValues = (effect: Effect): FieldValues => {
  const generateName = createEffectNameGenerator(effect.id);

  return {
    [generateName(EFFECT_TYPE)]: effect.type,
    [generateName(ACTION_TYPE)]: effect.action.type,
    [generateName(ACTION_PAYLOAD)]:
      effect.type === "field" ? effect.action.widgetIds : effect.action.pageId,
    ...generateFnFieldValues(effect.fn, effect.id),
  };
};

const isLogicalOperator = (value: unknown): value is LogicalType =>
  value === LogicalType.AND || value === LogicalType.OR;

const getFnFromFormValues = (
  fieldValues: FieldValues,
  effectId: SchemaId,
): Fn => {
  const logicalNames = createEffectNameGenerator(
    effectId,
    LOGICAL_FN_IDENTIFIER,
  );
  const firstNames = getComparisonFieldNames(
    effectId,
    FIRST_COMPARISON_FN_IDENTIFIER,
  );

  const logicalOperator = fieldValues[logicalNames(OPERATOR)] as unknown;

  const firstComparison: ComparisonFn = {
    type: fieldValues[firstNames.operator] as ComparisonType,
    fieldId: fieldValues[firstNames.fieldId] as SchemaId,
    value: fieldValues[firstNames.value],
  };

  if (!isLogicalOperator(logicalOperator)) {
    return firstComparison;
  }

  const secondNames = getComparisonFieldNames(
    effectId,
    SECOND_COMPARISON_FN_IDENTIFIER,
  );

  const secondComparison: ComparisonFn = {
    type: fieldValues[secondNames.operator] as ComparisonType,
    fieldId: fieldValues[secondNames.fieldId] as SchemaId,
    value: fieldValues[secondNames.value],
  };

  const logicalFn: LogicalFn = {
    type: logicalOperator,
    operands: [firstComparison, secondComparison],
  };

  return logicalFn;
};

export const getEffectFromFormValues = (
  pageId: SchemaId,
  effectId: SchemaId,
  fieldValues: FieldValues,
): Effect => {
  const generateName = createEffectNameGenerator(effectId);

  const effectType = fieldValues[generateName(EFFECT_TYPE)] as Effect["type"];
  const actionPayload = fieldValues[generateName(ACTION_PAYLOAD)] as unknown;
  const fn = getFnFromFormValues(fieldValues, effectId);

  if (effectType === "field") {
    const fieldEffect: FieldEffect = {
      id: effectId,
      owner: pageId,
      type: "field",
      action: {
        type: FieldActionType.HIDE_WIDGETS,
        widgetIds: Array.isArray(actionPayload)
          ? (actionPayload as SchemaId[])
          : [],
      },
      fn,
    };

    return fieldEffect;
  }

  const pageEffect: PageEffect = {
    id: effectId,
    owner: pageId,
    type: "page",
    action: {
      type: PageActionType.GO_TO_PAGE,
      pageId: actionPayload as SchemaId,
    },
    fn,
  };

  return pageEffect;
};

export const getEffectIds = (fieldValues: FieldValues): SchemaId[] => {
  const effectIds = Object.keys(fieldValues).flatMap(fieldName => {
    const [effectId, field] = fieldName.split(EFFECT_NAME_SEPARATOR);

    return effectId && field === EFFECT_TYPE ? [effectId] : [];
  });

  return Array.from(new Set(effectIds));
};

export const getEffectsFromFormValues = (
  pageId: SchemaId,
  fieldValues: FieldValues,
): Effect[] =>
  getEffectIds(fieldValues).map(effectId =>
    getEffectFromFormValues(pageId, effectId, fieldValues),
  );
