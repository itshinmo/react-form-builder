import { Button, Divider, FormHelperText, Grid, Stack } from "@mui/material";
import { produce } from "immer";
import { useFormContext } from "react-hook-form";
import {
  ComparisonType,
  isAlwaysFn,
  isLogicalFn,
  type ComparisonFn,
  type Effect,
  type Fn,
  type SchemaId,
} from "form-engine";
import { conditionTypeOptions } from "../../constants";
import {
  CONDITION_TYPE,
  EFFECT_NAME_SEPARATOR,
  FIRST_COMPARISON_FN_IDENTIFIER,
  FN_IDENTIFIER,
  LOGICAL_FN_IDENTIFIER,
  SECOND_COMPARISON_FN_IDENTIFIER,
} from "../../names";
import { Fieldset } from "../../utils";
import { ChoiceFormControl } from "../form-controls";
import { useEffectEditorData } from "./effect-context";
import { useEffectFieldNames } from "./hooks";
import { createEffectNameGenerator } from "./utils";
import ChainNodesSection from "./ChainNodesSection";
import ComparisonNode from "./ComparisonNode";
import LogicalNode from "./LogicalNode";
import NodeCard from "./NodeCard";
import {
  COMPARISON_NODE_GRIDSIZE,
  DIVIDER_GRIDSIZE,
  LOGICAL_NODE_GRIDSIZE,
} from "./fn-constants";

type Props = {
  fn: Fn;
  effectId: SchemaId;
  effectType: Effect["type"];
};

const DEFAULT_COMPARISON: ComparisonFn = {
  type: ComparisonType.EQ,
  fieldId: "",
  value: "",
};

const FnSection = (props: Props) => {
  const { fn, effectId, effectType } = props;

  const { unregister, watch, getValues } = useFormContext();
  const { fnFieldNames } = useEffectFieldNames(effectId);
  const effectEditorData = useEffectEditorData();

  if (!effectEditorData) return null;

  const { setAllEffects, allEffects } = effectEditorData;

  const conditionTypeFieldName =
    createEffectNameGenerator(effectId)(CONDITION_TYPE);

  const watchedConditionType = watch(conditionTypeFieldName) as
    | string
    | undefined;

  const conditionType =
    watchedConditionType ?? (isAlwaysFn(fn) ? "always" : "comparison");

  const isAlways = effectType === "page" && conditionType === "always";
  const displayFn: Fn = isAlwaysFn(fn) ? DEFAULT_COMPARISON : fn;

  const updateEffectFn = (newFn: Fn) => {
    setAllEffects(
      produce(allEffects, effectsDraft => {
        const effect = effectsDraft.find(item => item.id === effectId);
        if (effect) effect.fn = newFn;
      }),
    );
  };

  const handleConditionTypeChange = (value: string | string[]) => {
    const nextConditionType = String(value);

    if (nextConditionType === "always") {
      const effectPrefix = `${effectId}${EFFECT_NAME_SEPARATOR}`;

      Object.keys(getValues()).forEach(name => {
        if (name.startsWith(effectPrefix) && name.includes(FN_IDENTIFIER)) {
          unregister(name);
        }
      });

      updateEffectFn({ type: "ALWAYS" });
      return;
    }

    if (isAlwaysFn(fn)) {
      updateEffectFn(DEFAULT_COMPARISON);
    }
  };

  const conditionTypeControl =
    effectType === "page" ? (
      <ChoiceFormControl
        name={conditionTypeFieldName}
        label="Condition type"
        multiSelect={false}
        options={conditionTypeOptions}
        defaultValue={conditionType}
        onChange={handleConditionTypeChange}
        size="small"
        required
      />
    ) : null;

  if (isAlways) {
    return (
      <Fieldset title="Conditions">
        {conditionTypeControl}

        <FormHelperText>
          This effect runs every time the page is submitted.
        </FormHelperText>
      </Fieldset>
    );
  }

  if (isLogicalFn(displayFn)) {
    const [first, second] = displayFn.operands;

    const logicalFnFieldName = fnFieldNames.find(name =>
      name.includes(LOGICAL_FN_IDENTIFIER),
    );
    const firstFnFieldName = fnFieldNames.find(name =>
      name.includes(FIRST_COMPARISON_FN_IDENTIFIER),
    );
    const secondFnFieldName = fnFieldNames.find(name =>
      name.includes(SECOND_COMPARISON_FN_IDENTIFIER),
    );

    const logicalFnId =
      logicalFnFieldName?.split(EFFECT_NAME_SEPARATOR)[1] ??
      LOGICAL_FN_IDENTIFIER;
    const firstFnId =
      firstFnFieldName?.split(EFFECT_NAME_SEPARATOR)[1] ??
      FIRST_COMPARISON_FN_IDENTIFIER;
    const secondFnId =
      secondFnFieldName?.split(EFFECT_NAME_SEPARATOR)[1] ??
      SECOND_COMPARISON_FN_IDENTIFIER;

    const handleLogicalFnDelete = () => {
      if (logicalFnFieldName) unregister(logicalFnFieldName);

      updateEffectFn(first);

      fnFieldNames.forEach(name => {
        if (name.includes(secondFnId)) unregister(name);
      });
    };

    return (
      <Fieldset title="Conditions">
        {conditionTypeControl}

        <Grid container columns={5} alignItems="center">
          <Grid item xs={COMPARISON_NODE_GRIDSIZE}>
            <NodeCard>
              <ComparisonNode
                effectId={effectId}
                fnId={firstFnId}
                fnFieldNames={fnFieldNames}
                fieldId={first.fieldId}
                operator={first.type}
                value={first.value}
              />
            </NodeCard>
          </Grid>

          <Grid item xs={DIVIDER_GRIDSIZE}>
            <Divider orientation="horizontal" />
          </Grid>

          <Grid item xs={LOGICAL_NODE_GRIDSIZE}>
            <NodeCard>
              <Stack direction="column">
                <LogicalNode
                  effectId={effectId}
                  fnId={logicalFnId}
                  operator={displayFn.type}
                  fnFieldNames={fnFieldNames}
                />

                <Button type="button" onClick={handleLogicalFnDelete}>
                  Remove condition
                </Button>
              </Stack>
            </NodeCard>
          </Grid>

          <Grid item xs={DIVIDER_GRIDSIZE}>
            <Divider orientation="horizontal" />
          </Grid>

          <Grid item xs={COMPARISON_NODE_GRIDSIZE}>
            <NodeCard>
              <ComparisonNode
                effectId={effectId}
                fnId={secondFnId}
                fnFieldNames={fnFieldNames}
                fieldId={second.fieldId}
                operator={second.type}
                value={second.value}
              />
            </NodeCard>
          </Grid>
        </Grid>
      </Fieldset>
    );
  }

  const comparisonFn = displayFn;

  return (
    <Fieldset title="Conditions">
      {conditionTypeControl}

      <Grid container columns={5} alignItems="center">
        <Grid item xs={COMPARISON_NODE_GRIDSIZE}>
          <NodeCard>
            <ComparisonNode
              effectId={effectId}
              fnId={FIRST_COMPARISON_FN_IDENTIFIER}
              fnFieldNames={fnFieldNames}
              fieldId={comparisonFn.fieldId}
              operator={comparisonFn.type}
              value={comparisonFn.value}
            />
          </NodeCard>
        </Grid>

        <Grid item xs={DIVIDER_GRIDSIZE}>
          <Divider orientation="horizontal" />
        </Grid>

        <ChainNodesSection effectId={effectId} fnFieldNames={fnFieldNames} />
      </Grid>
    </Fieldset>
  );
};

export default FnSection;
