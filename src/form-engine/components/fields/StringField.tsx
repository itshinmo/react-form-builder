import { FormGroup, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { useSchema } from "../../schema-provider";
import type { FieldData, StringFieldWidget } from "../../schema/types";
import { useSchemaStateManager } from "../../state";
import { EMAIL_PATTERN, getErrorMessage } from "../../validation";
import { mergeSx } from "shared/utils";
import handleFieldEffects, { withFieldValue } from "./handle-field-effects";
import * as sx from "./styles";
import usePageData from "./use-page-data";

const StringField = (props: StringFieldWidget) => {
  const {
    id,
    label,
    description,
    inputType,
    placeholder,
    maxLength,
    minLength,
    defaultValue = "",
    required = false,
    multiline = false,
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
      minLength,
      maxLength,
      pattern: inputType === "email" ? EMAIL_PATTERN : undefined,
    },
  });

  if (!schema || !stateManager) return null;

  const errorMessage = getErrorMessage(fieldState, { maxLength, minLength });

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
        type={inputType}
        multiline={multiline}
        placeholder={placeholder}
        helperText={errorMessage}
        required={required}
        error={Boolean(errorMessage)}
        onChange={handleChange}
      />
    </FormGroup>
  );
};

export default StringField;
