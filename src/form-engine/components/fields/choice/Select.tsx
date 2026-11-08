import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select as MuiSelect,
  Typography,
  type SelectChangeEvent,
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

const Select = (props: ChoiceComponentProps) => {
  const { field: widget, options, label } = props;
  const {
    id,
    multiSelect,
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
    multiSelect
      ? Array.isArray(defaultValue)
        ? defaultValue
        : []
      : typeof defaultValue === "string"
      ? defaultValue
      : "",
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
          if (!multiSelect || maxRequired === undefined) return true;

          return Array.isArray(values) && values.length <= maxRequired;
        },
        minRequired: values => {
          if (!multiSelect || minRequired === undefined) return true;

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

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
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
      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          data-slot="description"
        >
          {description}
        </Typography>
      )}

      <FormControl required={required} error={Boolean(errorMessage)} fullWidth>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>

        <MuiSelect
          {...field}
          labelId={`${id}-label`}
          id={id}
          label={label}
          multiple={multiSelect}
          input={<OutlinedInput label={label} />}
          onChange={handleChange}
        >
          {!required && !multiSelect && (
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
          )}

          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>

        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default Select;
