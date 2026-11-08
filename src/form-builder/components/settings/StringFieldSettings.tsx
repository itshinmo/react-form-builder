import { Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { stringInputTypeOptions } from "../../constants";
import * as names from "../../names";
import { Fieldset } from "../../utils";
import {
  BooleanFormControl,
  ChoiceFormControl,
  NumberFormControl,
  StringFormControl,
} from "../form-controls";
import type { WidgetSettingsProps } from "./types";

const StringFieldSettings = (props: WidgetSettingsProps) => {
  const { shouldUnregister = false } = props;

  const { watch } = useFormContext();

  const inputType = watch(names.INPUT_TYPE) as "text" | "email" | undefined;
  const maxLength = watch(names.MAX_LENGTH) as number | undefined;
  const minLength = watch(names.MIN_LENGTH) as number | undefined;
  const multiline = watch(names.MULTILINE) as boolean | undefined;

  return (
    <Stack direction="column">
      <Fieldset title="Base Information">
        <StringFormControl
          name={names.LABEL}
          label="Label"
          placeholder="Enter a label"
          description="The name of the field, visible to the user."
          shouldUnregister={shouldUnregister}
          required
        />

        <ChoiceFormControl
          name={names.INPUT_TYPE}
          label="Input type"
          options={stringInputTypeOptions}
          multiSelect={false}
          shouldUnregister={shouldUnregister}
          required
        />

        <StringFormControl
          name={names.DESCRIPTION}
          label="Description"
          placeholder="Enter a description"
          shouldUnregister={shouldUnregister}
        />

        <StringFormControl
          name={names.PLACEHOLDER}
          label="Placeholder"
          description="Text shown inside the field until a value is entered."
          placeholder="Enter a placeholder"
          shouldUnregister={shouldUnregister}
        />

        <BooleanFormControl
          name={names.REQUIRED}
          label="Is this field required"
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>

      <Fieldset title="Value Information">
        <BooleanFormControl
          name={names.MULTILINE}
          label="Allow multiple lines"
          shouldUnregister={shouldUnregister}
        />

        <StringFormControl
          name={names.DEFAULT_VALUE}
          label="Initial value"
          description="The value the field starts with."
          placeholder="Enter an initial value"
          type={inputType}
          maxLength={maxLength}
          minLength={minLength}
          multiline={multiline}
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>

      <Fieldset title="Validation">
        <NumberFormControl
          name={names.MAX_LENGTH}
          label="Maximum character count"
          description="Maximum number of characters allowed."
          placeholder="Enter a maximum character count"
          shouldUnregister={shouldUnregister}
        />

        <NumberFormControl
          name={names.MIN_LENGTH}
          label="Minimum character count"
          description="Minimum number of characters required."
          placeholder="Enter a minimum character count"
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>
    </Stack>
  );
};

export default StringFieldSettings;
