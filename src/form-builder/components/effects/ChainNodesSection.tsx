import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  type SelectChangeEvent,
} from "@mui/material";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { SchemaId } from "form-engine";
import { logicalOperators } from "../../constants";
import {
  LOGICAL_FN_IDENTIFIER,
  OPERATOR,
  SECOND_COMPARISON_FN_IDENTIFIER,
} from "../../names";
import { ChoiceFormControl } from "../form-controls";
import { createEffectNameGenerator } from "./utils";
import {
  COMPARISON_NODE_GRIDSIZE,
  DIVIDER_GRIDSIZE,
  LOGICAL_NODE_GRIDSIZE,
} from "./fn-constants";
import ComparisonNode from "./ComparisonNode";
import NodeCard from "./NodeCard";

type Props = {
  effectId: SchemaId;
  fnFieldNames: string[];
};

const ChainNodesSection = (props: Props) => {
  const { effectId, fnFieldNames } = props;

  const { unregister, getValues } = useFormContext();

  const [logicalOperator, setLogicalOperator] = React.useState("");

  const logicalFnId = LOGICAL_FN_IDENTIFIER;
  const comparisonFnId = SECOND_COMPARISON_FN_IDENTIFIER;

  const logicalFnOperatorName = createEffectNameGenerator(
    effectId,
    logicalFnId,
  )(OPERATOR);

  const handleLogicalNodeChange = (event: SelectChangeEvent<string>) => {
    setLogicalOperator(event.target.value);
  };

  const handleClear = () => {
    const logicalPrefix = `${effectId}~${logicalFnId}~`;
    const secondPrefix = `${effectId}~${comparisonFnId}~`;

    Object.keys(getValues()).forEach(name => {
      if (name.startsWith(logicalPrefix) || name.startsWith(secondPrefix)) {
        unregister(name);
      }
    });

    setLogicalOperator("");
  };

  if (logicalOperator) {
    return (
      <>
        <Grid item xs={LOGICAL_NODE_GRIDSIZE}>
          <NodeCard>
            <Stack direction="column">
              <ChoiceFormControl
                name={logicalFnOperatorName}
                label="Operator"
                multiSelect={false}
                options={logicalOperators}
                defaultValue={logicalOperator}
                size="small"
                onChange={newValue => setLogicalOperator(String(newValue))}
                shouldUnregister
              />

              <Button type="button" onClick={handleClear}>
                Clear
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
              fnId={comparisonFnId}
              fnFieldNames={fnFieldNames}
              fieldId=""
              operator=""
              value=""
              shouldUnregister
              required
            />
          </NodeCard>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Grid item xs={LOGICAL_NODE_GRIDSIZE}>
        <NodeCard>
          <FormControl fullWidth size="small">
            <InputLabel id="logical-fn-operator-label">Operator</InputLabel>

            <Select
              labelId="logical-fn-operator-label"
              label="Operator"
              value={logicalOperator}
              onChange={handleLogicalNodeChange}
            >
              {logicalOperators.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </NodeCard>
      </Grid>

      <Grid item xs={DIVIDER_GRIDSIZE} />

      <Grid item xs={COMPARISON_NODE_GRIDSIZE} />
    </>
  );
};

export default ChainNodesSection;
