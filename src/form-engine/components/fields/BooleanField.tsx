import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Switch,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { mergeSx } from "shared/utils";
import { useSchema } from "../../schema-provider";
import type { BooleanFieldWidget, FieldData } from "../../schema/types";
import { useSchemaStateManager } from "../../state";
import { getErrorMessage } from "../../validation";
import handleFieldEffects, { withFieldValue } from "./handle-field-effects";
import * as sx from "./styles";
import usePageData from "./use-page-data";

const BooleanField = (props: BooleanFieldWidget) => {
  const { id, label, defaultChecked, description, required = false } = props;

  const schema = useSchema();
  const stateManager = useSchemaStateManager();
  const { control, getValues } = useFormContext();

  const storedValue = usePageData(id, defaultChecked);

  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue: storedValue,
    shouldUnregister: false,
    rules: { required },
  });

  if (!schema || !stateManager) return null;

  const errorMessage = getErrorMessage(fieldState);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const newValue = event.target.checked;

    field.onChange(newValue);
    handleFieldEffects(
      schema,
      stateManager,
      withFieldValue(getValues() as FieldData, id, newValue),
    );
  };

  return (
    <FormControl error={Boolean(errorMessage)} sx={mergeSx(sx.fieldWidget)}>
      {description && (
        <FormLabel>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </FormLabel>
      )}

      <FormGroup>
        <FormControlLabel
          required={required}
          id={id}
          control={
            <Switch
              {...field}
              checked={Boolean(field.value)}
              inputProps={{ role: "switch", "aria-labelledby": `${id}-label` }}
              onChange={handleChange}
            />
          }
          label={<span id={`${id}-label`}>{label}</span>}
        />
      </FormGroup>

      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default BooleanField;
