import { Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import * as names from "../../names";
import { Fieldset } from "../../utils";
import {
  BooleanFormControl,
  NumberFormControl,
  StringFormControl,
} from "../form-controls";
import type { WidgetSettingsProps } from "./types";

const NumberFieldSettings = (props: WidgetSettingsProps) => {
  const { shouldUnregister = false } = props;

  const { watch } = useFormContext();

  const min = watch(names.MIN) as number | undefined;
  const max = watch(names.MAX) as number | undefined;

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
        <NumberFormControl
          name={names.DEFAULT_VALUE}
          label="Initial value"
          description="The value the field starts with."
          placeholder="Enter an initial value"
          min={min}
          max={max}
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>

      <Fieldset title="Validation">
        <NumberFormControl
          name={names.MAX}
          label="Maximum value"
          description="Largest value accepted by the field."
          placeholder="Enter a maximum value"
          shouldUnregister={shouldUnregister}
        />

        <NumberFormControl
          name={names.MIN}
          label="Minimum value"
          description="Smallest value accepted by the field."
          placeholder="Enter a minimum value"
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>
    </Stack>
  );
};

export default NumberFieldSettings;
