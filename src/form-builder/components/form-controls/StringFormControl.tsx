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
import { EMAIL_PATTERN, getErrorMessage } from "form-engine/validation";
import * as sx from "../commonStyles";
import { formatString } from "../../formatInput";

type Props = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  multiline?: boolean;
  defaultValue?: string;
  required?: boolean;
  pattern?: RegExp;
  type?: "text" | "email";
  size?: FormControlProps["size"];
  shouldUnregister?: boolean;
  onChange?: (newValue: string) => void;
};

const StringFormControl = (props: Props) => {
  const {
    name,
    label,
    description,
    placeholder,
    onChange,
    maxLength,
    minLength,
    defaultValue: defaultValueProp = "",
    required = false,
    multiline = false,
    type = "text",
    size = "medium",
    shouldUnregister = false,
    pattern,
  } = props;

  const { control, getValues } = useFormContext();

  const defaultValue =
    (getValues(name) as string | undefined) ?? defaultValueProp;

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
    rules: {
      required,
      maxLength,
      minLength,
      pattern: type === "email" ? EMAIL_PATTERN : pattern,
    },
  });

  const errorMessage = getErrorMessage(fieldState, { maxLength, minLength });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = formatString(event.target.value);

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
          error={Boolean(errorMessage)}
          size={size}
          {...field}
          sx={sx.input}
          label={label}
          type={type}
          multiline={multiline}
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
        error={Boolean(errorMessage)}
        required={required}
        {...field}
        sx={sx.input}
        id={`field-${name}`}
        multiline={multiline}
        aria-labelledby={`field-${name}-label`}
        aria-describedby={`field-${name}-description`}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        size={size}
      />

      {renderHelperText()}
    </FormControl>
  );
};

export default StringFormControl;
