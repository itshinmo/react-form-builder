import type { SchemaId } from "form-engine";
import {
  type ACTION_PAYLOAD,
  type ACTION_TYPE,
  type CONDITION_TYPE,
  type EFFECT_TYPE,
  type FIELD_ID,
  type OPERATOR,
  type VALUE,
} from "../../names";

export type EffectFieldName =
  | typeof EFFECT_TYPE
  | typeof ACTION_TYPE
  | typeof ACTION_PAYLOAD
  | typeof CONDITION_TYPE;

export type EffectConditionType = "always" | "comparison";

export type FnFieldName = typeof OPERATOR | typeof FIELD_ID | typeof VALUE;

export type EffectFormFieldName = EffectFieldName | FnFieldName;

export type FnNodeProps = {
  effectId: SchemaId;
  fnId: SchemaId;
  operator: string;
  fnFieldNames: string[];
  required?: boolean;
  shouldUnregister?: boolean;
};

export type ComparisonFnNodeProps = FnNodeProps & {
  value: unknown;
  fieldId: SchemaId;
};

export type LogicalFnNodeProps = FnNodeProps & {
  onChange?: (newValue: string) => void;
};
