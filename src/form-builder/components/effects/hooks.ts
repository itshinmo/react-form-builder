import { useFormContext } from "react-hook-form";
import {
  ComparisonType,
  type ChoiceOption,
  type EffectType,
  type SchemaId,
} from "form-engine";
import {
  comparisonOperators,
  fieldEffectActions,
  pageEffectActions,
} from "../../constants";
import { useFormStateManager } from "../../state";
import { EFFECT_NAME_SEPARATOR, FN_IDENTIFIER } from "../../names";
import type { FieldWidgetNode } from "../../types";
import { isPageNode } from "../../utils";
import { useEditModalItem } from "../EditModalItemContext";

export const useEffectActionOptions = (effectType: EffectType) => {
  const formStateManager = useFormStateManager();
  const currentItem = useEditModalItem();

  if (!formStateManager || !currentItem || !isPageNode(currentItem)) {
    return null;
  }

  const { state } = formStateManager;

  const selectablePages = state.pages.allIds.filter(
    pageId => pageId !== currentItem.id,
  );

  const payloadOptions: ChoiceOption[] =
    effectType === "field"
      ? currentItem.widgetIds.flatMap(widgetId => {
          const widget = state.widgets.byId[widgetId];

          return widget ? [{ label: widget.label, value: widgetId }] : [];
        })
      : selectablePages.flatMap(pageId => {
          const page = state.pages.byId[pageId];

          return page ? [{ label: page.title, value: pageId }] : [];
        });

  const typeOptions =
    effectType === "field" ? fieldEffectActions : pageEffectActions;

  return { payloadOptions, typeOptions };
};

export const useEffectFieldNames = (effectId: SchemaId) => {
  const { getValues, formState } = useFormContext();

  const prefix = `${effectId}${EFFECT_NAME_SEPARATOR}`;
  const allValues = getValues();

  const effectFieldNames = Object.keys(allValues).filter(name =>
    name.startsWith(prefix),
  );

  const fnFieldNames = effectFieldNames.filter(name =>
    name.includes(FN_IDENTIFIER),
  );

  const effectErrors = Object.keys(formState.errors).filter(name =>
    name.startsWith(prefix),
  );

  return { effectFieldNames, fnFieldNames, effectErrors };
};

export const useFieldComparisonOptions = (fieldId: SchemaId) => {
  const formStateManager = useFormStateManager();

  if (!fieldId || !formStateManager) return comparisonOperators;

  const widget = formStateManager.state.widgets.byId[fieldId] as
    | FieldWidgetNode
    | undefined;

  if (!widget || widget.kind !== "field") return comparisonOperators;

  switch (widget.type) {
    case "string":
    case "boolean":
      return comparisonOperators.filter(
        option =>
          option.value === ComparisonType.EQ ||
          option.value === ComparisonType.NEQ,
      );

    case "number":
      return comparisonOperators.filter(
        option =>
          option.value !== ComparisonType.IN &&
          option.value !== ComparisonType.NIN,
      );

    case "choice":
      return comparisonOperators.filter(
        option =>
          option.value === ComparisonType.IN ||
          option.value === ComparisonType.NIN,
      );

    default:
      return comparisonOperators;
  }
};
