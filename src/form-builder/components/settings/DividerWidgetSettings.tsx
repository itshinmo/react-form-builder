import { Stack } from "@mui/material";
import * as names from "../../names";
import { Fieldset } from "../../utils";
import { StringFormControl } from "../form-controls";
import type { WidgetSettingsProps } from "./types";

const DividerWidgetSettings = (props: WidgetSettingsProps) => {
  const { shouldUnregister = false } = props;

  return (
    <Stack direction="column">
      <Fieldset title="Base Information">
        <StringFormControl
          name={names.LABEL}
          label="Label"
          description="Used to identify this widget in the builder. It is not shown to users."
          placeholder="Enter a label"
          required
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>
    </Stack>
  );
};

export default DividerWidgetSettings;
