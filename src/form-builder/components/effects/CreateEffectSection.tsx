import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import {
  type ComparisonType,
  FieldActionType,
  PageActionType,
  type Effect,
  type EffectType,
  type FieldEffect,
  type Fn,
  type PageEffect,
} from "form-engine";
import { NUMBER_PATTERN } from "form-engine/validation";
import { conditionTypeOptions, effectTypeOptions } from "../../constants";
import { useFormStateManager } from "../../state";
import { EFFECT_IDENTIFIER } from "../../names";
import { Fieldset, isFieldWidgetNode, isPageNode } from "../../utils";
import { useEditModalItem } from "../EditModalItemContext";
import type { EffectConditionType } from "./types";
import { generateEffectFieldValues, generateId } from "./utils";
import { useEffectEditorData } from "./effect-context";
import { useEffectActionOptions, useFieldComparisonOptions } from "./hooks";

const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null || value === "") return true;

  return Array.isArray(value) && value.length === 0;
};

const CreateEffectSection = () => {
  const [effectType, setEffectType] = React.useState<EffectType | "">("");
  const [conditionType, setConditionType] =
    React.useState<EffectConditionType>("comparison");
  const [actionType, setActionType] = React.useState("");
  const [actionPayload, setActionPayload] = React.useState<string | string[]>(
    [],
  );
  const [fieldId, setFieldId] = React.useState("");
  const [operator, setOperator] = React.useState("");
  const [expectedValue, setExpectedValue] = React.useState<unknown>("");
  const [expectedValueErrorMessage, setExpectedValueErrorMessage] =
    React.useState("");

  const form = useFormContext();
  const formStateManager = useFormStateManager();
  const effectEditorData = useEffectEditorData();
  const currentPage = useEditModalItem();

  const fieldComparisonOptions = useFieldComparisonOptions(fieldId);
  const effectActionOptions = useEffectActionOptions(effectType || "field");

  const resetStates = React.useCallback(() => {
    setEffectType("");
    setConditionType("comparison");
    setActionType("");
    setActionPayload([]);
    setFieldId("");
    setOperator("");
    setExpectedValue("");
    setExpectedValueErrorMessage("");
  }, []);

  const isAlwaysCondition = effectType === "page" && conditionType === "always";

  const hasError =
    !effectType ||
    !actionType ||
    isEmptyValue(actionPayload) ||
    (!isAlwaysCondition &&
      (!fieldId ||
        !operator ||
        isEmptyValue(expectedValue) ||
        Boolean(expectedValueErrorMessage)));

  if (!effectEditorData || !effectActionOptions) return null;
  if (!currentPage || !isPageNode(currentPage)) return null;
  if (!formStateManager) return null;

  const { payloadOptions, typeOptions } = effectActionOptions;
  const { setAllEffects, allFieldWidgetOptions } = effectEditorData;
  const { setValue } = form;
  const { state } = formStateManager;

  const handleEffectTypeChange = (event: SelectChangeEvent<string>) => {
    const newEffectType = event.target.value as EffectType;

    setEffectType(newEffectType);

    if (newEffectType === "field") {
      setConditionType("comparison");
    }

    setActionType("");
    setActionPayload(newEffectType === "field" ? [] : "");
  };

  const handleFieldWidgetChange = (event: SelectChangeEvent<string>) => {
    const newFieldId = event.target.value;
    const widget = state.widgets.byId[newFieldId];

    if (!widget || !isFieldWidgetNode(widget)) return;

    setFieldId(newFieldId);
    setOperator("");
    setExpectedValueErrorMessage("");

    switch (widget.type) {
      case "string":
      case "number":
        setExpectedValue("");
        break;

      case "boolean":
        setExpectedValue(false);
        break;

      case "choice":
        setExpectedValue("");
        break;

      default:
        break;
    }
  };

  const handleAddClick = () => {
    if (hasError || !effectType) return;

    const id = `${EFFECT_IDENTIFIER}${generateId()}`;
    const fn: Fn = isAlwaysCondition
      ? { type: "ALWAYS" }
      : {
          type: operator as ComparisonType,
          fieldId,
          value: expectedValue,
        };

    let newEffect: Effect;

    if (effectType === "field") {
      const action: FieldEffect["action"] = {
        type: FieldActionType.HIDE_WIDGETS,
        widgetIds: Array.isArray(actionPayload)
          ? actionPayload
          : [actionPayload],
      };

      newEffect = {
        id,
        owner: currentPage.id,
        type: "field",
        action,
        fn,
      } satisfies FieldEffect;
    } else {
      const action: PageEffect["action"] = {
        type: PageActionType.GO_TO_PAGE,
        pageId: String(actionPayload),
      };

      newEffect = {
        id,
        owner: currentPage.id,
        type: "page",
        action,
        fn,
      } satisfies PageEffect;
    }

    const fieldValues = generateEffectFieldValues(newEffect);

    for (const [name, value] of Object.entries(fieldValues)) {
      setValue(name, value, { shouldValidate: true });
    }

    setAllEffects(previous => [...previous, newEffect]);
    resetStates();
  };

  const renderExpectedValueInput = () => {
    const valueAsString =
      typeof expectedValue === "string" || typeof expectedValue === "number"
        ? String(expectedValue)
        : "";

    const defaultInput = (
      <TextField
        margin="dense"
        error={
          Boolean(expectedValueErrorMessage) || isEmptyValue(expectedValue)
        }
        size="small"
        value={valueAsString}
        label="Expected value"
        onChange={event => {
          const newValue = event.target.value;

          if (fieldId) {
            const widget = state.widgets.byId[fieldId];

            if (widget?.kind === "field" && widget.type === "number") {
              setExpectedValueErrorMessage(
                NUMBER_PATTERN.test(newValue) || newValue === ""
                  ? ""
                  : "Please enter a number.",
              );
            }
          }

          setExpectedValue(newValue);
        }}
        fullWidth
        required
      />
    );

    if (!fieldId) return defaultInput;

    const widget = state.widgets.byId[fieldId];

    if (!widget || !isFieldWidgetNode(widget)) return null;

    switch (widget.type) {
      case "boolean":
        return (
          <FormControl margin="dense" fullWidth size="small">
            <FormControlLabel
              sx={{ justifyContent: "space-between", margin: 0 }}
              id="expected-value-field-label"
              label="Expected value"
              labelPlacement="start"
              control={
                <Switch
                  onChange={(_event, checked) => setExpectedValue(checked)}
                  checked={Boolean(expectedValue)}
                  inputProps={{
                    role: "switch",
                    "aria-labelledby": "expected-value-field-label",
                  }}
                />
              }
            />
          </FormControl>
        );

      case "choice":
        return (
          <FormControl
            error={isEmptyValue(expectedValue)}
            margin="dense"
            required
            fullWidth
            size="small"
          >
            <InputLabel id="expected-value-field-label">
              Expected value
            </InputLabel>

            <Select
              id="expected-value-field"
              labelId="expected-value-field-label"
              label="Expected value"
              onChange={event => setExpectedValue(event.target.value)}
              value={typeof expectedValue === "string" ? expectedValue : ""}
            >
              {widget.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        return defaultInput;
    }
  };

  const renderEffectFields = () => {
    if (!effectType) return null;

    return (
      <>
        <FormControl
          margin="dense"
          error={!actionType}
          size="small"
          fullWidth
          required
        >
          <InputLabel id="action-type-select-label">Action type</InputLabel>

          <Select
            labelId="action-type-select-label"
            label="Action type"
            value={actionType}
            onChange={event => setActionType(event.target.value)}
          >
            {typeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          margin="dense"
          error={isEmptyValue(actionPayload)}
          size="small"
          fullWidth
          required
        >
          <InputLabel id="action-payload-select-label">
            Action payload
          </InputLabel>

          <Select
            labelId="action-payload-select-label"
            label="Action payload"
            value={actionPayload}
            onChange={event => setActionPayload(event.target.value)}
            multiple={effectType === "field"}
          >
            {payloadOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {effectType === "page" && (
          <FormControl margin="dense" size="small" fullWidth required>
            <InputLabel id="condition-type-select-label">
              Condition type
            </InputLabel>

            <Select
              labelId="condition-type-select-label"
              label="Condition type"
              value={conditionType}
              onChange={event =>
                setConditionType(event.target.value as EffectConditionType)
              }
            >
              {conditionTypeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isAlwaysCondition ? (
          <FormHelperText>
            This effect runs every time the page is submitted.
          </FormHelperText>
        ) : (
          <Stack direction="row" alignItems="center" gap={1}>
            <FormControl
              margin="dense"
              error={!fieldId}
              size="small"
              fullWidth
              required
            >
              <InputLabel id="condition-widget-select-label">
                Field widget
              </InputLabel>

              <Select
                labelId="condition-widget-select-label"
                label="Field widget"
                value={fieldId}
                onChange={handleFieldWidgetChange}
              >
                {allFieldWidgetOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              margin="dense"
              error={!operator}
              size="small"
              fullWidth
              required
            >
              <InputLabel id="condition-operator-select-label">
                Operator
              </InputLabel>

              <Select
                labelId="condition-operator-select-label"
                label="Operator"
                value={operator}
                onChange={event => setOperator(event.target.value)}
              >
                {fieldComparisonOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {renderExpectedValueInput()}
          </Stack>
        )}

        <Stack direction="row" alignItems="center" gap={1} marginTop={1}>
          <Button
            color="secondary"
            variant="outlined"
            fullWidth
            type="button"
            onClick={resetStates}
          >
            Cancel
          </Button>

          <Button
            disabled={hasError}
            variant="outlined"
            fullWidth
            type="button"
            onClick={handleAddClick}
          >
            Add effect
          </Button>
        </Stack>

        {hasError && (
          <FormHelperText error>
            All fields need to be filled correctly.
          </FormHelperText>
        )}

        {!isAlwaysCondition && expectedValueErrorMessage && (
          <FormHelperText error>{expectedValueErrorMessage}</FormHelperText>
        )}
      </>
    );
  };

  return (
    <Fieldset title="Create Effect">
      <Stack direction="column">
        <FormControl margin="dense" size="small" fullWidth>
          <InputLabel id="effect-type-select-label">Effect type</InputLabel>

          <Select
            labelId="effect-type-select-label"
            label="Effect type"
            value={effectType}
            onChange={handleEffectTypeChange}
          >
            {effectTypeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {renderEffectFields()}
      </Stack>
    </Fieldset>
  );
};

export default CreateEffectSection;
