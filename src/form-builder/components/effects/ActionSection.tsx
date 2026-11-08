import { FormGroup } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { Effect, EffectType } from "form-engine";
import { effectTypeOptions } from "../../constants";
import {
  ACTION_PAYLOAD,
  ACTION_TYPE,
  CONDITION_TYPE,
  EFFECT_TYPE,
} from "../../names";
import { Fieldset } from "../../utils";
import { ChoiceFormControl } from "../form-controls";
import { useEffectActionOptions, useEffectFieldNames } from "./hooks";

type Props = {
  effect: Effect;
};

const ActionSection = (props: Props) => {
  const { effect } = props;

  const { setValue, trigger, watch } = useFormContext();
  const { effectFieldNames } = useEffectFieldNames(effect.id);

  const effectTypeFieldName = effectFieldNames.find(key =>
    key.includes(EFFECT_TYPE),
  );

  const actionTypeFieldName = effectFieldNames.find(key =>
    key.includes(ACTION_TYPE),
  );
  const actionPayloadFieldName = effectFieldNames.find(key =>
    key.includes(ACTION_PAYLOAD),
  );
  const conditionTypeFieldName = effectFieldNames.find(key =>
    key.includes(CONDITION_TYPE),
  );

  const effectType =
    ((effectTypeFieldName ? watch(effectTypeFieldName) : undefined) as
      | EffectType
      | undefined) ?? effect.type;

  const actionOptions = useEffectActionOptions(effectType);

  if (
    !effectTypeFieldName ||
    !actionTypeFieldName ||
    !actionPayloadFieldName ||
    !actionOptions
  ) {
    return null;
  }

  const handleEffectTypeChange = (value: string | string[]) => {
    const newEffectType = String(value);

    setValue(actionTypeFieldName, "");
    setValue(effectTypeFieldName, newEffectType);
    setValue(actionPayloadFieldName, newEffectType === "field" ? [] : "");

    if (newEffectType === "field" && conditionTypeFieldName) {
      setValue(conditionTypeFieldName, "comparison");
    }

    void trigger([actionTypeFieldName, actionPayloadFieldName]);
  };

  const { payloadOptions, typeOptions } = actionOptions;

  return (
    <>
      <ChoiceFormControl
        name={effectTypeFieldName}
        label="Effect type"
        size="small"
        multiSelect={false}
        options={effectTypeOptions}
        onChange={handleEffectTypeChange}
        required
      />

      <Fieldset title="Effect Action">
        <FormGroup>
          <ChoiceFormControl
            key={`${effectType}-effect-action`}
            name={actionTypeFieldName}
            label="Action type"
            size="small"
            multiSelect={false}
            options={typeOptions}
            required
          />

          <ChoiceFormControl
            name={actionPayloadFieldName}
            label="Action payload"
            size="small"
            multiSelect={effectType === "field"}
            options={payloadOptions}
            required
          />
        </FormGroup>
      </Fieldset>
    </>
  );
};

export default ActionSection;
