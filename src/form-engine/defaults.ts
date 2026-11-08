import type { DocumentSchema, FieldData } from "./schema/types";

/**
 * Builds the initial react-hook-form values for every field in a schema.
 */
export const getSchemaDefaultValues = (schema: DocumentSchema): FieldData => {
  const defaultValues: FieldData = {};

  for (const widget of Object.values(schema.definitions.widgets)) {
    if (widget.kind !== "field") continue;

    switch (widget.type) {
      case "string":
        defaultValues[widget.id] = widget.defaultValue ?? "";
        break;

      case "number":
        defaultValues[widget.id] = widget.defaultValue;
        break;

      case "boolean":
        defaultValues[widget.id] = widget.defaultChecked;
        break;

      case "choice":
        defaultValues[widget.id] =
          widget.defaultValue ?? (widget.multiSelect ? [] : "");
        break;

      default:
        break;
    }
  }

  return defaultValues;
};
