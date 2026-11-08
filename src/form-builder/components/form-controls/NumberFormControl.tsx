import {
  FormControl,
  type FormControlProps,
  FormHelperText,
  FormLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { getErrorMessage, NUMBER_PATTERN } from "form-engine/validation";
import * as sx from "../commonStyles";

type Props = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  max?: number;
  min?: number;
  defaultValue?: number | string;
  required?: boolean;
  size?: FormControlProps["size"];
  shouldUnregister?: boolean;
  onChange?: (newValue: number | undefined) => void;
};

const NumberFormControl = (props: Props) => {
  const {
    label,
    description,
    name,
    placeholder,
    max,
    min,
    onChange,
    defaultValue: defaultValueProp = "",
    required = false,
    shouldUnregister = false,
    size = "medium",
  } = props;

  const { control, getValues } = useFormContext();

  const defaultValue = (getValues(name) as unknown) ?? defaultValueProp;

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
    rules: {
      required,
      min,
      max,
      pattern: NUMBER_PATTERN,
    },
  });

  const errorMessage = getErrorMessage(fieldState, { max, min });

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = event => {
    const newValue = event.target.value;

    field.onChange(newValue);

    if (onChange) {
      onChange(newValue === "" ? undefined : Number(newValue));
    }
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

  if (!description) {
    return (
      <FormControl
        required={required}
        sx={sx.formControl}
        fullWidth
        error={Boolean(errorMessage)}
        size={size}
      >
        <TextField
          required={required}
          size={size}
          error={Boolean(errorMessage)}
          {...field}
          sx={sx.input}
          label={label}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          onChange={handleChange}
        />

        {renderHelperText()}
      </FormControl>
    );
  }

  return (
    <FormControl
      required={required}
      sx={sx.formControl}
      fullWidth
      error={Boolean(errorMessage)}
      size={size}
    >
      <FormLabel htmlFor={`field-${name}`} id={`field-${name}-label`}>
        {label}
      </FormLabel>

      {renderDescription()}

      <OutlinedInput
        required={required}
        size={size}
        error={Boolean(errorMessage)}
        {...field}
        sx={sx.input}
        id={`field-${name}`}
        aria-labelledby={`field-${name}-label`}
        aria-describedby={`field-${name}-description`}
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
      />

      {renderHelperText()}
    </FormControl>
  );
};

export default NumberFormControl;
