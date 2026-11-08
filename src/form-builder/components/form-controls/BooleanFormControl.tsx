import {
  FormControl,
  FormControlLabel,
  type FormControlProps,
  FormHelperText,
  Switch,
} from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import { getErrorMessage } from "form-engine/validation";
import * as sx from "../commonStyles";

type Props = {
  name: string;
  label: string;
  onChange?: (value: boolean) => void;
  shouldUnregister?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  size?: FormControlProps["size"];
};

const BooleanFormControl = (props: Props) => {
  const {
    label,
    name,
    onChange,
    defaultChecked = false,
    required = false,
    shouldUnregister = false,
    size = "medium",
  } = props;

  const { control, getValues } = useFormContext();

  const defaultValue = (getValues(name) as unknown) ?? defaultChecked;

  const { field, fieldState } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
    rules: { required },
  });

  const errorMessage = getErrorMessage(fieldState);

  const handleChange = () => {
    const newValue = !field.value;

    field.onChange(newValue);
    onChange?.(newValue);
  };

  return (
    <FormControl
      required={required}
      fullWidth
      sx={sx.formControl}
      error={Boolean(errorMessage)}
      size={size}
    >
      <FormControlLabel
        sx={sx.switchInput}
        id={`field-${name}`}
        label={label}
        labelPlacement="start"
        control={
          <Switch
            {...field}
            onChange={handleChange}
            checked={Boolean(field.value)}
            inputProps={{
              role: "switch",
              "aria-labelledby": `field-${name}`,
            }}
          />
        }
      />

      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default BooleanFormControl;
