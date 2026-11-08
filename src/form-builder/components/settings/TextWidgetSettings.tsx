import { Stack } from "@mui/material";
import { textVariantOptions } from "../../constants";
import * as names from "../../names";
import { Fieldset } from "../../utils";
import { ChoiceFormControl, StringFormControl } from "../form-controls";
import type { WidgetSettingsProps } from "./types";

const TextWidgetSettings = (props: WidgetSettingsProps) => {
  const { shouldUnregister = false } = props;

  return (
    <Stack direction="column">
      <Fieldset title="Base Information">
        <StringFormControl
          name={names.LABEL}
          label="Label"
          description="Used to identify this widget in the builder (for example when connecting effects). It is not shown to users."
          placeholder="Enter a label"
          required
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>

      <Fieldset title="Text Information">
        <StringFormControl
          name={names.TEXT}
          label="Text"
          placeholder="Enter text"
          shouldUnregister={shouldUnregister}
          required
        />

        <ChoiceFormControl
          name={names.VARIANT}
          label="Text style"
          options={textVariantOptions}
          multiSelect={false}
          shouldUnregister={shouldUnregister}
          required
        />
      </Fieldset>
    </Stack>
  );
};

export default TextWidgetSettings;
