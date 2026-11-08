import { FormGroup, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { mergeSx } from "shared/utils";
import { useSchema } from "../../schema-provider";
import type { FieldData, NumberFieldWidget } from "../../schema/types";
import { useSchemaStateManager } from "../../state";
import { getErrorMessage, NUMBER_PATTERN } from "../../validation";
import handleFieldEffects, { withFieldValue } from "./handle-field-effects";
import * as sx from "./styles";
import usePageData from "./use-page-data";

const NumberField = (props: NumberFieldWidget) => {
  const {
    id,
    label,
    max,
    min,
    defaultValue,
    description,
    required = false,
    placeholder,
  } = props;

  const schema = useSchema();
  const stateManager = useSchemaStateManager();
  const { control, getValues } = useFormContext();

  const storedValue = usePageData(id, defaultValue);

  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue: storedValue,
    shouldUnregister: false,
    rules: {
      required,
      max,
      min,
      pattern: NUMBER_PATTERN,
    },
  });

  if (!schema || !stateManager) return null;

  const errorMessage = getErrorMessage(fieldState, { max, min });

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = event => {
    const newValue = event.target.value;

    field.onChange(newValue);
    handleFieldEffects(
      schema,
      stateManager,
      withFieldValue(getValues() as FieldData, id, newValue),
    );
  };

  return (
    <FormGroup sx={mergeSx(sx.fieldWidget)}>
      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          data-slot="description"
        >
          {description}
        </Typography>
      )}

      <TextField
        {...field}
        fullWidth
        id={id}
        label={label}
        type="text"
        inputMode="decimal"
        required={required}
        placeholder={placeholder}
        helperText={errorMessage}
        error={Boolean(errorMessage)}
        onChange={handleChange}
      />
    </FormGroup>
  );
};

export default NumberField;
