import type { SchemaStateManagerContext } from "../../state";
import { getVisibleWidgetIds } from "../../schema/effects";
import type { DocumentSchema, FieldData } from "../../schema/types";

/**
 * Re-evaluates field effects after a value changed and updates the widgets
 * visible on the current page.
 *
 * The updated value is passed explicitly because react-hook-form may not have
 * committed the change to `getValues()` yet.
 */
const handleFieldEffects = (
  schema: DocumentSchema,
  stateManager: SchemaStateManagerContext,
  fieldData: FieldData,
): void => {
  const { currentPage } = stateManager.state;

  stateManager.setVisibleWidgets(
    getVisibleWidgetIds(schema, currentPage, fieldData),
  );
};

export const withFieldValue = (
  fieldData: FieldData,
  widgetId: string,
  value: unknown,
): FieldData => ({ ...fieldData, [widgetId]: value });

export default handleFieldEffects;
