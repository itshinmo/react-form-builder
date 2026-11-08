import { FormGroup } from "@mui/material";
import { logicalOperators } from "../../constants";
import { OPERATOR } from "../../names";
import { ChoiceFormControl } from "../form-controls";
import type { LogicalFnNodeProps } from "./types";
import { createEffectNameGenerator } from "./utils";

const LogicalNode = (props: LogicalFnNodeProps) => {
  const {
    effectId,
    fnId,
    fnFieldNames,
    operator,
    onChange,
    shouldUnregister,
    required = true,
  } = props;

  const generateEffectName = createEffectNameGenerator(effectId, fnId);

  const operatorEffectName =
    fnFieldNames.find(key => key.includes(fnId) && key.includes(OPERATOR)) ??
    generateEffectName(OPERATOR);

  return (
    <FormGroup>
      <ChoiceFormControl
        name={operatorEffectName}
        label="Operator"
        multiSelect={false}
        options={logicalOperators}
        defaultValue={operator}
        size="small"
        required={required}
        onChange={value => onChange?.(String(value))}
        shouldUnregister={shouldUnregister}
      />
    </FormGroup>
  );
};

export default LogicalNode;
