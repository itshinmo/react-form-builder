import { useFormContext } from "react-hook-form";
import {
  FIELD_WIDGET_TYPE_OPTIONS,
  UI_WIDGET_TYPE_OPTIONS,
  WIDGET_KIND_OPTIONS,
} from "form-engine/schema/constants";
import type { WidgetKind, WidgetType } from "form-engine/schema/types";
import * as names from "../names";
import { Fieldset } from "../utils";
import { ChoiceFormControl } from "./form-controls";
import {
  BooleanFieldSettings,
  ChoiceFieldSettings,
  DividerWidgetSettings,
  LinkWidgetSettings,
  NumberFieldSettings,
  StringFieldSettings,
  TextWidgetSettings,
} from "./settings";

const NewWidgetSection = () => {
  const { watch, setValue } = useFormContext();

  const widgetKind = watch(names.WIDGET_KIND) as WidgetKind | null;
  const widgetType = watch(names.WIDGET_TYPE) as WidgetType | null;

  const handleWidgetKindChange = () => {
    setValue(names.WIDGET_TYPE, "");
  };

  const renderWidgetTypeSelect = () => {
    if (!widgetKind) return null;

    return (
      <ChoiceFormControl
        name={names.WIDGET_TYPE}
        label={widgetKind === "field" ? "Field widget type" : "UI widget type"}
        options={
          widgetKind === "field"
            ? FIELD_WIDGET_TYPE_OPTIONS
            : UI_WIDGET_TYPE_OPTIONS
        }
        multiSelect={false}
        defaultValue=""
        size="small"
        shouldUnregister
        required
      />
    );
  };

  const renderWidgetSettings = () => {
    if (!widgetType) return null;

    switch (widgetType) {
      case "string":
        return <StringFieldSettings shouldUnregister />;

      case "number":
        return <NumberFieldSettings shouldUnregister />;

      case "boolean":
        return <BooleanFieldSettings shouldUnregister />;

      case "choice":
        return <ChoiceFieldSettings shouldUnregister />;

      case "text":
        return <TextWidgetSettings shouldUnregister />;

      case "link":
        return <LinkWidgetSettings shouldUnregister />;

      case "divider":
        return <DividerWidgetSettings shouldUnregister />;

      default:
        return null;
    }
  };

  return (
    <>
      <Fieldset title="Type Information">
        <ChoiceFormControl
          name={names.WIDGET_KIND}
          label="Widget kind"
          options={WIDGET_KIND_OPTIONS}
          multiSelect={false}
          defaultValue=""
          size="small"
          onChange={handleWidgetKindChange}
          required
        />

        {renderWidgetTypeSelect()}
      </Fieldset>

      {renderWidgetSettings()}
    </>
  );
};

export default NewWidgetSection;
