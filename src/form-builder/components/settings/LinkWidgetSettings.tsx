import { Stack } from "@mui/material";
import * as names from "../../names";
import { Fieldset } from "../../utils";
import { StringFormControl } from "../form-controls";
import type { WidgetSettingsProps } from "./types";

// Accept absolute URLs as well as protocol-relative/domain-only links.
const LINK_PATTERN = /^(?:https?:\/\/)?[\w-]+(?:\.[\w-]+)+(?:[/?#][^\s]*)?$/i;

const LinkWidgetSettings = (props: WidgetSettingsProps) => {
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

      <Fieldset title="Link Information">
        <StringFormControl
          name={names.TEXT}
          label="Link text"
          placeholder="Enter link text"
          description="The text displayed for this link."
          required
          shouldUnregister={shouldUnregister}
        />

        <StringFormControl
          name={names.HREF}
          label="Link URL"
          placeholder="https://example.com"
          description="The destination of the link."
          required
          shouldUnregister={shouldUnregister}
          pattern={LINK_PATTERN}
        />
      </Fieldset>
    </Stack>
  );
};

export default LinkWidgetSettings;
