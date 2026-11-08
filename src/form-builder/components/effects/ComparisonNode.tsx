import { FormGroup, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { SchemaId } from "form-engine";
import { useFormStateManager } from "../../state";
import type { ComparisonFnNodeProps } from "./types";
import { createEffectNameGenerator } from "./utils";
import {
  BooleanFormControl,
  ChoiceFormControl,
  NumberFormControl,
  StringFormControl,
} from "../form-controls";
import { FIELD_ID, OPERATOR, VALUE } from "../../names";
import { useEffectEditorData } from "./effect-context";
import { useFieldComparisonOptions } from "./hooks";

const ComparisonNode = (props: ComparisonFnNodeProps) => {
  const {
    effectId,
    fnId,
    fieldId: fieldIdProp,
    operator,
    value,
    fnFieldNames,
    shouldUnregister,
    required = true,
  } = props;

  const generateEffectName = createEffectNameGenerator(effectId, fnId);

  const { watch, setValue } = useFormContext();
  const effectEditorData = useEffectEditorData();
  const formStateManager = useFormStateManager();

  const fieldIdEffectName =
    fnFieldNames.find(key => key.includes(fnId) && key.includes(FIELD_ID)) ??
    generateEffectName(FIELD_ID);

  const operatorEffectName =
    fnFieldNames.find(key => key.includes(fnId) && key.includes(OPERATOR)) ??
    generateEffectName(OPERATOR);

  const valueEffectName =
    fnFieldNames.find(key => key.includes(fnId) && key.includes(VALUE)) ??
    generateEffectName(VALUE);

  const watchedFieldId = watch(fieldIdEffectName) as SchemaId | undefined;
  const fieldId = watchedFieldId ?? fieldIdProp;

  const fieldComparisonOptions = useFieldComparisonOptions(fieldId);

  if (!effectEditorData || !formStateManager) return null;

  const { allFieldWidgetOptions } = effectEditorData;
  const { state } = formStateManager;

  const handleFieldIdChange = (newFieldId: string) => {
    const widget = state.widgets.byId[newFieldId];

    if (!widget || widget.kind !== "field") return;

    setValue(operatorEffectName, "");

    switch (widget.type) {
      case "string":
      case "number":
        setValue(valueEffectName, "");
        break;

      case "boolean":
        setValue(valueEffectName, false);
        break;

      case "choice":
        setValue(valueEffectName, "");
        break;

      default:
        break;
    }
  };

  const renderValueInput = () => {
    if (!fieldId) {
      return (
        <StringFormControl
          size="small"
          name={valueEffectName}
          label="Expected value"
          defaultValue={typeof value === "string" ? value : ""}
          required={required}
          shouldUnregister={shouldUnregister}
        />
      );
    }

    const widget = state.widgets.byId[fieldId];

    if (!widget || widget.kind !== "field") return null;

    switch (widget.type) {
      case "string":
        return (
          <StringFormControl
            size="small"
            name={valueEffectName}
            label="Expected value"
            defaultValue={typeof value === "string" ? value : ""}
            required={required}
            shouldUnregister={shouldUnregister}
          />
        );

      case "number":
        return (
          <NumberFormControl
            size="small"
            name={valueEffectName}
            label="Expected value"
            defaultValue={typeof value === "number" ? value : undefined}
            required={required}
            shouldUnregister={shouldUnregister}
          />
        );

      case "boolean":
        return (
          <BooleanFormControl
            size="small"
            name={valueEffectName}
            label="Expected value"
            defaultChecked={Boolean(value)}
            shouldUnregister={shouldUnregister}
          />
        );

      case "choice":
        return (
          <ChoiceFormControl
            size="small"
            name={valueEffectName}
            label="Expected value"
            defaultValue={typeof value === "string" ? value : ""}
            shouldUnregister={shouldUnregister}
            multiSelect={false}
            options={widget.options}
            required={required}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormGroup>
      <Stack>
        <ChoiceFormControl
          size="small"
          name={fieldIdEffectName}
          label="Field widget"
          multiSelect={false}
          defaultValue={fieldId}
          options={allFieldWidgetOptions}
          required={required}
          shouldUnregister={shouldUnregister}
          onChange={newValue => handleFieldIdChange(String(newValue))}
        />

        <ChoiceFormControl
          size="small"
          name={operatorEffectName}
          label="Operator"
          multiSelect={false}
          defaultValue={operator}
          options={fieldComparisonOptions}
          required={required}
          shouldUnregister={shouldUnregister}
        />

        {renderValueInput()}
      </Stack>
    </FormGroup>
  );
};

export default ComparisonNode;
