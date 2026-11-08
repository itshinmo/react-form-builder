import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Typography,
} from "@mui/material";
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

const CheckboxGroup = (props: ChoiceComponentProps) => {
  const { field: widget, options, label } = props;
  const {
    id,
    description,
    maxRequired,
    minRequired,
    required = false,
    defaultValue,
  } = widget;

  const schema = useSchema();
  const stateManager = useSchemaStateManager();
  const { control, getValues } = useFormContext();

  const storedValue = usePageData(
    id,
    Array.isArray(defaultValue) ? defaultValue : [],
  );

  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue: storedValue,
    shouldUnregister: false,
    rules: {
      required,
      validate: {
        maxRequired: values => {
          if (maxRequired === undefined) return true;

          return Array.isArray(values) && values.length <= maxRequired;
        },
        minRequired: values => {
          if (minRequired === undefined) return true;

          const selected = Array.isArray(values) ? values : [];
          if (!required && selected.length === 0) return true;

          return selected.length >= minRequired;
        },
      },
    },
  });

  if (!schema || !stateManager) return null;

  const errorMessage = getErrorMessage(fieldState, {
    maxRequired,
    minRequired,
  });

  const selectedValues = Array.isArray(field.value)
    ? (field.value as string[])
    : [];

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter(value => value !== optionValue);

    field.onChange(newValues);
    handleFieldEffects(
      schema,
      stateManager,
      withFieldValue(getValues() as FieldData, id, newValues),
    );
  };

  return (
    <Box sx={mergeSx(sx.fieldWidget)}>
      <FormControl required={required} error={Boolean(errorMessage)} fullWidth>
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

        <FormGroup aria-labelledby={`${id}-label`}>
          {options.map(option => (
            <FormControlLabel
              key={option.value}
              label={option.label}
              control={
                <Checkbox
                  id={`${id}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onChange={event =>
                    handleOptionChange(option.value, event.target.checked)
                  }
                  inputProps={{ "aria-labelledby": `${id}-${option.value}` }}
                />
              }
            />
          ))}
        </FormGroup>

        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default CheckboxGroup;
