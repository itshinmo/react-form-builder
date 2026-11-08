import { Delete as DeleteIcon } from "@mui/icons-material";
import { FormHelperText, IconButton, Stack, TextField } from "@mui/material";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { ChoiceFieldWidget, ChoiceOption } from "form-engine/schema/types";
import * as names from "../../names";
import * as choiceSx from "./ChoiceFieldSettings.styles";

type Props = {
  options: ChoiceOption[];
};

const OptionsContainer = (props: Props) => {
  const { options } = props;

  const { setValue, getValues, setError, clearErrors, formState } =
    useFormContext();

  const hasOptionsError = Boolean(formState.errors[names.OPTIONS]);

  React.useEffect(() => {
    if (options.length === 0 && !hasOptionsError) {
      setError(names.OPTIONS, {
        message: "Please add at least one option.",
      });

      return;
    }

    if (options.length > 0 && hasOptionsError) {
      clearErrors(names.OPTIONS);
    }
  }, [clearErrors, hasOptionsError, options.length, setError]);

  const makeHandleOptionDelete = (value: string) => () => {
    const newOptions = options.filter(option => option.value !== value);

    setValue(names.OPTIONS, newOptions, { shouldValidate: true });

    const defaultValue = getValues(
      names.DEFAULT_VALUE,
    ) as ChoiceFieldWidget["defaultValue"];

    if (typeof defaultValue === "string" && defaultValue === value) {
      setValue(names.DEFAULT_VALUE, "");
      return;
    }

    if (Array.isArray(defaultValue) && defaultValue.includes(value)) {
      setValue(
        names.DEFAULT_VALUE,
        defaultValue.filter(item => item !== value),
      );
    }
  };

  const renderOptions = () => {
    if (options.length === 0) {
      return (
        <FormHelperText error>
          No options provided. Please add at least one option.
        </FormHelperText>
      );
    }

    return options.map(option => (
      <Stack
        key={option.value}
        sx={choiceSx.choiceOption}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <TextField
          value={option.label}
          size="small"
          label="Label"
          type="text"
          placeholder="Option label"
          inputProps={{ readOnly: true }}
        />

        <TextField
          value={option.value}
          size="small"
          label="Value"
          type="text"
          placeholder="Option value"
          inputProps={{ readOnly: true }}
        />

        <IconButton
          type="button"
          aria-label={`Delete option ${option.label}`}
          onClick={makeHandleOptionDelete(option.value)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    ));
  };

  return (
    <Stack direction="column" justifyContent="center">
      {renderOptions()}
    </Stack>
  );
};

export default OptionsContainer;
