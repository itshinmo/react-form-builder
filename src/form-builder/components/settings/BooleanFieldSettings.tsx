import { Stack } from "@mui/material";
import * as names from "../../names";
import { Fieldset } from "../../utils";
import { BooleanFormControl, StringFormControl } from "../form-controls";
import type { WidgetSettingsProps } from "./types";

const BooleanFieldSettings = (props: WidgetSettingsProps) => {
  const { shouldUnregister = false } = props;

  return (
    <Stack direction="column">
      <Fieldset title="Base Information">
        <StringFormControl
          name={names.LABEL}
          label="Label"
          description="The name of the field, visible to the user."
          placeholder="Enter a label"
          required
          shouldUnregister={shouldUnregister}
        />

        <StringFormControl
          name={names.DESCRIPTION}
          label="Description"
          placeholder="Enter a description"
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
          name={names.DEFAULT_CHECKED}
          label="Checked by default"
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>
    </Stack>
  );
};

export default BooleanFieldSettings;
