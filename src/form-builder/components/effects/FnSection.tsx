import { Button, Divider, Grid, Stack } from "@mui/material";
import { produce } from "immer";
import { useFormContext } from "react-hook-form";
import { isLogicalFn, type Fn, type SchemaId } from "form-engine";
import {
  EFFECT_NAME_SEPARATOR,
  FIRST_COMPARISON_FN_IDENTIFIER,
  LOGICAL_FN_IDENTIFIER,
  SECOND_COMPARISON_FN_IDENTIFIER,
} from "../../names";
import { Fieldset } from "../../utils";
import { useEffectEditorData } from "./effect-context";
import { useEffectFieldNames } from "./hooks";
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
};

const FnSection = (props: Props) => {
  const { fn, effectId } = props;

  const { unregister } = useFormContext();
  const { fnFieldNames } = useEffectFieldNames(effectId);
  const effectEditorData = useEffectEditorData();

  if (!effectEditorData) return null;

  const { setAllEffects, allEffects } = effectEditorData;

  if (isLogicalFn(fn)) {
    const [first, second] = fn.operands;

    const logicalFnFieldName = fnFieldNames.find(name =>
      name.includes(LOGICAL_FN_IDENTIFIER),
    );
    const firstFnFieldName = fnFieldNames.find(name =>
      name.includes(FIRST_COMPARISON_FN_IDENTIFIER),
    );
    const secondFnFieldName = fnFieldNames.find(name =>
      name.includes(SECOND_COMPARISON_FN_IDENTIFIER),
    );

    if (!logicalFnFieldName || !firstFnFieldName || !secondFnFieldName) {
      return null;
    }

    const logicalFnId = logicalFnFieldName.split(EFFECT_NAME_SEPARATOR)[1];
    const firstFnId = firstFnFieldName.split(EFFECT_NAME_SEPARATOR)[1];
    const secondFnId = secondFnFieldName.split(EFFECT_NAME_SEPARATOR)[1];

    if (!logicalFnId || !firstFnId || !secondFnId) return null;

    const handleLogicalFnDelete = () => {
      unregister(logicalFnFieldName);

      setAllEffects(
        produce(allEffects, effectsDraft => {
          const effect = effectsDraft.find(item => item.id === effectId);
          if (effect) effect.fn = first;
        }),
      );

      fnFieldNames.forEach(name => {
        if (name.includes(secondFnId)) unregister(name);
      });
    };

    return (
      <Fieldset title="Conditions">
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
                  operator={fn.type}
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

  const comparisonFnFieldName = fnFieldNames.find(name =>
    name.includes(FIRST_COMPARISON_FN_IDENTIFIER),
  );

  if (!comparisonFnFieldName) return null;

  const fnId = comparisonFnFieldName.split(EFFECT_NAME_SEPARATOR)[1];

  if (!fnId) return null;

  return (
    <Fieldset title="Conditions">
      <Grid container columns={5} alignItems="center">
        <Grid item xs={COMPARISON_NODE_GRIDSIZE}>
          <NodeCard>
            <ComparisonNode
              effectId={effectId}
              fnId={fnId}
              fnFieldNames={fnFieldNames}
              fieldId={fn.fieldId}
              operator={fn.type}
              value={fn.value}
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
