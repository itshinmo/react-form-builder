import { ComparisonType, LogicalType } from "./constants";
import type {
  AlwaysFn,
  DocumentSchema,
  FieldData,
  FieldEffect,
  Fn,
  LogicalFn,
  PageData,
  PageEffect,
  SchemaId,
  Widget,
} from "./types";

export const isFieldWidget = (
  widget: Widget,
): widget is Extract<Widget, { kind: "field" }> => widget.kind === "field";

export const isLogicalFn = (fn: Fn): fn is LogicalFn =>
  fn.type === LogicalType.AND || fn.type === LogicalType.OR;

export const isAlwaysFn = (fn: Fn): fn is AlwaysFn => fn.type === "ALWAYS";

const containsValue = (
  actualValue: unknown,
  expectedValue: unknown,
): boolean => {
  const expected = String(expectedValue);

  if (Array.isArray(actualValue)) {
    return actualValue.includes(expected);
  }

  if (typeof actualValue === "string" || typeof actualValue === "number") {
    return String(actualValue) === expected;
  }

  return false;
};

const compare = (
  type: ComparisonType,
  actualValue: unknown,
  expectedValue: unknown,
): boolean => {
  switch (type) {
    case ComparisonType.EQ:
      return actualValue === expectedValue;

    case ComparisonType.NEQ:
      return actualValue !== expectedValue;

    case ComparisonType.GT:
      return Number(actualValue) > Number(expectedValue);

    case ComparisonType.GTE:
      return Number(actualValue) >= Number(expectedValue);

    case ComparisonType.LT:
      return Number(actualValue) < Number(expectedValue);

    case ComparisonType.LTE:
      return Number(actualValue) <= Number(expectedValue);

    case ComparisonType.IN:
      return containsValue(actualValue, expectedValue);

    case ComparisonType.NIN:
      return !containsValue(actualValue, expectedValue);

    default:
      return false;
  }
};

/**
 * Evaluates an effect condition against the current field values.
 */
export const isEffectTriggered = (fn: Fn, fieldData: FieldData): boolean => {
  if (isAlwaysFn(fn)) return true;

  if (isLogicalFn(fn)) {
    const [left, right] = fn.operands;

    switch (fn.type) {
      case LogicalType.AND:
        return (
          isEffectTriggered(left, fieldData) &&
          isEffectTriggered(right, fieldData)
        );

      case LogicalType.OR:
        return (
          isEffectTriggered(left, fieldData) ||
          isEffectTriggered(right, fieldData)
        );

      default:
        return false;
    }
  }

  if (!(fn.fieldId in fieldData)) return false;

  return compare(fn.type, fieldData[fn.fieldId], fn.value);
};

const getPageEffectsById = (
  pageId: SchemaId,
  schema: DocumentSchema,
): PageEffect[] => {
  const page = schema.definitions.pages[pageId];

  if (!page) return [];

  return (page.effectIds ?? [])
    .map(effectId => schema.definitions.effects[effectId])
    .filter(
      (effect): effect is PageEffect =>
        effect !== undefined && effect.type === "page",
    );
};

const getFieldEffectsById = (
  pageId: SchemaId,
  schema: DocumentSchema,
): FieldEffect[] => {
  const page = schema.definitions.pages[pageId];

  if (!page) return [];

  return (page.effectIds ?? [])
    .map(effectId => schema.definitions.effects[effectId])
    .filter(
      (effect): effect is FieldEffect =>
        effect !== undefined && effect.type === "field",
    );
};

export const getPageEffects = getPageEffectsById;
export const getFieldEffects = getFieldEffectsById;

/**
 * Returns the first triggered page effect that points at an existing page.
 * This is the same condition the form uses to decide whether the next click
 * navigates or submits.
 */
export const getTriggeredPageEffect = (
  schema: DocumentSchema,
  pageId: SchemaId,
  fieldData: FieldData,
): PageEffect | undefined =>
  getPageEffectsById(pageId, schema).find(
    effect =>
      isEffectTriggered(effect.fn, fieldData) &&
      Boolean(schema.definitions.pages[effect.action.pageId]),
  );

/**
 * Returns the ids of all widgets that should be visible on `pageId` for the
 * given field values.
 *
 * Triggered hide-effects are combined (union), so multiple effects cannot
 * accidentally re-show widgets hidden by another effect.
 */
export const getVisibleWidgetIds = (
  schema: DocumentSchema,
  pageId: SchemaId,
  fieldData: FieldData,
): SchemaId[] => {
  const page = schema.definitions.pages[pageId];

  if (!page) return [];

  const hiddenWidgetIds = new Set<SchemaId>();

  for (const effect of getFieldEffectsById(pageId, schema)) {
    if (!isEffectTriggered(effect.fn, fieldData)) continue;

    for (const widgetId of effect.action.widgetIds) {
      hiddenWidgetIds.add(widgetId);
    }
  }

  return (page.widgetIds ?? []).filter(
    widgetId => !hiddenWidgetIds.has(widgetId),
  );
};

/**
 * Removes values of widgets that are not currently visible. This keeps data
 * from hidden/deleted widgets out of the submitted result.
 */
export const getVisibleFieldData = (
  data: FieldData,
  visibleWidgetIds: readonly SchemaId[],
): FieldData => {
  const visibleWidgetIdSet = new Set(visibleWidgetIds);

  return Object.fromEntries(
    Object.entries(data).filter(([widgetId]) =>
      visibleWidgetIdSet.has(widgetId),
    ),
  );
};

/**
 * Flattens the values of completed pages and removes values of widgets that
 * are hidden by effects or no longer present in the schema.
 */
export const getVisiblePageData = (
  schema: DocumentSchema,
  pageIds: readonly SchemaId[],
  pageData: PageData,
): FieldData => {
  const result: FieldData = {};

  for (const pageId of pageIds) {
    const data = pageData[pageId] ?? {};
    const visibleWidgetIds = getVisibleWidgetIds(schema, pageId, data);

    Object.assign(result, getVisibleFieldData(data, visibleWidgetIds));
  }

  return result;
};
