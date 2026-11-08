import { Divider, FormControl, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { ChoiceFieldWidget } from "form-engine/schema/types";
import * as names from "../../names";
import { Fieldset } from "../../utils";
import * as sx from "../commonStyles";
import {
  BooleanFormControl,
  ChoiceFormControl,
  NumberFormControl,
  StringFormControl,
} from "../form-controls";
import NewOptionSection from "./NewOptionSection";
import OptionsContainer from "./OptionsContainer";
import type { WidgetSettingsProps } from "./types";

const ChoiceFieldSettings = (props: WidgetSettingsProps) => {
  const { shouldUnregister = false } = props;

  const { watch, setValue } = useFormContext();

  const multiSelect = Boolean(watch(names.MULTISELECT));
  const options =
    (watch(names.OPTIONS) as ChoiceFieldWidget["options"] | undefined) ?? [];
  const maxRequired = watch(names.MAX_REQUIRED) as number | undefined;
  const minRequired = watch(names.MIN_REQUIRED) as number | undefined;

  const handleMultiSelectChange = (newMultiSelect: boolean) => {
    setValue(names.DEFAULT_VALUE, newMultiSelect ? [] : "");
  };

  return (
    <Stack direction="column">
      <Fieldset title="Base Information">
        <StringFormControl
          name={names.LABEL}
          label="Label"
          placeholder="Enter a label"
          description="The name of the field, visible to the user."
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
          name={names.MULTISELECT}
          label="Allow selecting multiple options"
          onChange={handleMultiSelectChange}
          shouldUnregister={shouldUnregister}
        />

        <FormControl sx={sx.formControl} fullWidth>
          <Fieldset title="Options">
            <NewOptionSection key={options.length} options={options} />
            <Divider sx={sx.divider} />
            <OptionsContainer options={options} />
          </Fieldset>
        </FormControl>

        <ChoiceFormControl
          name={names.DEFAULT_VALUE}
          label="Initial value"
          options={options}
          multiSelect={multiSelect}
          maxRequired={maxRequired}
          minRequired={minRequired}
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>

      <Fieldset title="Validation">
        <NumberFormControl
          name={names.MAX_REQUIRED}
          label="Maximum selection count"
          description="Maximum number of options that can be selected. Only enforced when the field is required or a value is selected."
          placeholder="Enter a maximum selection count"
          shouldUnregister={shouldUnregister}
        />

        <NumberFormControl
          name={names.MIN_REQUIRED}
          label="Minimum selection count"
          description="Minimum number of options that can be selected. Only enforced when the field is required or a value is selected."
          placeholder="Enter a minimum selection count"
          shouldUnregister={shouldUnregister}
        />

        <BooleanFormControl
          name={names.SHUFFLE_OPTIONS}
          label="Shuffle options"
          shouldUnregister={shouldUnregister}
        />
      </Fieldset>
    </Stack>
  );
};

export default ChoiceFieldSettings;
