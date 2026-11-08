import { Add as AddIcon } from "@mui/icons-material";
import { FormHelperText, IconButton, Stack, TextField } from "@mui/material";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { ChoiceOption } from "form-engine/schema/types";
import { formatString } from "../../formatInput";
import * as names from "../../names";

type Props = {
  options: ChoiceOption[];
};

const NewOptionSection = (props: Props) => {
  const { options } = props;

  const { setValue } = useFormContext();

  const [label, setLabel] = React.useState("");
  const [value, setValueInput] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleLabelChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLabel(formatString(event.target.value));
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = formatString(event.target.value);
    setValueInput(newValue);

    const allValues = options.map(option => option.value);

    setErrorMessage(
      allValues.includes(newValue)
        ? "This value is already used by another option."
        : "",
    );
  };

  const handleAddClick = () => {
    if (!label || !value || errorMessage) return;

    const newOptions = [...options, { label, value }];

    setValue(names.OPTIONS, newOptions, { shouldValidate: true });
    setLabel("");
    setValueInput("");
    setErrorMessage("");
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" gap={1}>
        <TextField
          label="Label"
          type="text"
          size="small"
          placeholder="Option label"
          value={label}
          onChange={handleLabelChange}
        />

        <TextField
          label="Value"
          type="text"
          size="small"
          placeholder="Option value"
          value={value}
          onChange={handleValueChange}
          error={Boolean(errorMessage)}
        />

        <IconButton
          type="button"
          aria-label="Add option"
          onClick={handleAddClick}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>

      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </>
  );
};

export default NewOptionSection;
