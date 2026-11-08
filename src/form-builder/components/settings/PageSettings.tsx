import { Stack } from "@mui/material";
import * as names from "../../names";
import { Fieldset } from "../../utils";
import { StringFormControl } from "../form-controls";

const PageSettings = () => (
  <Stack direction="column">
    <Fieldset title="Base Information">
      <StringFormControl
        name={names.TITLE}
        label="Title"
        description="The page title, visible to the user."
        placeholder="Enter a title"
        required
      />
    </Fieldset>
  </Stack>
);

export default PageSettings;
