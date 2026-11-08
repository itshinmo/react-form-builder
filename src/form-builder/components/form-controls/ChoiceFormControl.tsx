import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  type FormControlProps,
  type SelectChangeEvent,
  type SelectProps,
} from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import type { ChoiceOption } from "form-engine/schema/types";
import { getErrorMessage } from "form-engine/validation";
import * as sx from "../commonStyles";

type Props = {
  name: string;
  label: string;
  options: ChoiceOption[];
  multiSelect: boolean;
  description?: string;
  maxRequired?: number;
  minRequired?: number;
  defaultValue?: string | string[];
  required?: boolean;
  size?: FormControlProps["size"];
  fullWidth?: boolean;
  shouldUnregister?: boolean;
  variant?: SelectProps["variant"];
  onChange?: (currentValue: string | string[]) => void;
};

const ChoiceFormControl = (props: Props) => {
  const {
    name,
    label,
    multiSelect,
    options,
    description,
    maxRequired,
    minRequired,
    onChange,
    defaultValue: defaultValueProp,
    required = false,
    size = "medium",
    variant = "outlined",
    fullWidth = true,
    shouldUnregister = false,
  } = props;

  const { control, getValues } = useFormContext();

  const defaultValue =
    (getValues(name) as unknown) ?? defaultValueProp ?? (multiSelect ? [] : "");

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
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

  const errorMessage = getErrorMessage(fieldState, {
    maxRequired,
    minRequired,
  });

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const newValue = event.target.value;

    field.onChange(newValue);
    onChange?.(newValue);
  };

  const renderDescription = () => {
    if (!description) return null;

    return (
      <Typography
        sx={sx.fieldDescription}
        id={`field-${name}-description`}
        variant="body2"
      >
        {description}
      </Typography>
    );
  };

  const renderHelperText = () =>
    errorMessage ? <FormHelperText>{errorMessage}</FormHelperText> : null;

  const renderOptions = () =>
    options.map(option => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ));

  const renderEmptyOption = () => {
    if (required || multiSelect) return null;

    return (
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
    );
  };

  if (description) {
    return (
      <FormControl
        required={required}
        sx={sx.formControl}
        fullWidth={fullWidth}
        size={size}
        error={Boolean(errorMessage)}
      >
        <FormLabel htmlFor={`field-${name}`} id={`field-${name}-label`}>
          {label}
        </FormLabel>

        {renderDescription()}

        <Select
          error={Boolean(errorMessage)}
          {...field}
          multiple={multiSelect}
          sx={sx.input}
          id={`field-${name}`}
          labelId={`field-${name}-label`}
          aria-describedby={`field-${name}-description`}
          onChange={handleChange}
          variant={variant}
        >
          {renderEmptyOption()}
          {renderOptions()}
        </Select>

        {renderHelperText()}
      </FormControl>
    );
  }

  return (
    <FormControl
      required={required}
      sx={sx.formControl}
      fullWidth={fullWidth}
      error={Boolean(errorMessage)}
      size={size}
    >
      <InputLabel htmlFor={`field-${name}`} id={`field-${name}-label`}>
        {label}
      </InputLabel>

      <Select
        error={Boolean(errorMessage)}
        {...field}
        multiple={multiSelect}
        id={`field-${name}`}
        labelId={`field-${name}-label`}
        label={label}
        onChange={handleChange}
        variant={variant}
      >
        {renderEmptyOption()}
        {renderOptions()}
      </Select>

      {renderHelperText()}
    </FormControl>
  );
};

export default ChoiceFormControl;
