import * as React from "react";
import { shuffleArray } from "shared/utils";
import type { ChoiceFieldWidget } from "../../schema/types";
import { CheckboxGroup, RadioGroup, Select } from "./choice";
import { SELECT_OPTIONS_THRESHOLD } from "./choice/constants";

const ChoiceField = (props: ChoiceFieldWidget) => {
  const {
    multiSelect,
    options: optionsProp,
    shuffleOptions = false,
    label,
  } = props;

  const options = React.useMemo(
    () => (shuffleOptions ? shuffleArray(optionsProp) : optionsProp),
    [optionsProp, shuffleOptions],
  );

  if (options.length >= SELECT_OPTIONS_THRESHOLD) {
    return <Select field={props} options={options} label={label} />;
  }

  if (multiSelect) {
    return <CheckboxGroup field={props} options={options} label={label} />;
  }

  return <RadioGroup field={props} options={options} label={label} />;
};

export default ChoiceField;
