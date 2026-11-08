import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { mergeSx } from "shared/utils";
import { useSchema } from "../../../schema-provider";
import type { FieldData } from "../../../schema/types";
import { useSchemaStateManager } from "../../../state";
import { getErrorMessage } from "../../../validation";
import {
  default as handleFieldEffects,
  withFieldValue,
} from "../handle-field-effects";
import * as sx from "../styles";
import usePageData from "../use-page-data";
import type { ChoiceComponentProps } from "./types";

const RadioGroup = (props: ChoiceComponentProps) => {
  const { field: widget, options, label } = props;
  const { id, description, required = false, defaultValue } = widget;

  const schema = useSchema();
  const stateManager = useSchemaStateManager();
  const { control, getValues } = useFormContext();

  const storedValue = usePageData(
    id,
    typeof defaultValue === "string" ? defaultValue : "",
  );

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
    const newValue = event.target.value;

    field.onChange(newValue);
    handleFieldEffects(
      schema,
      stateManager,
      withFieldValue(getValues() as FieldData, id, newValue),
    );
  };

  return (
    <Box sx={mergeSx(sx.fieldWidget)}>
      <FormControl fullWidth required={required} error={Boolean(errorMessage)}>
        <FormLabel id={`${id}-label`} component="legend">
          {label}
        </FormLabel>

        {description && (
          <Typography
            variant="body1"
            color="text.secondary"
            data-slot="description"
          >
            {description}
          </Typography>
        )}

        <MuiRadioGroup
          {...field}
          aria-labelledby={`${id}-label`}
          onChange={handleChange}
        >
          {options.map(option => (
            <FormControlLabel
              id={`${id}-${option.value}`}
              key={option.value}
              control={
                <Radio inputProps={{ "aria-labelledby": `${id}-label` }} />
              }
              value={option.value}
              label={option.label}
            />
          ))}
        </MuiRadioGroup>

        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default RadioGroup;
