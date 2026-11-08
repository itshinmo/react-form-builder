import type { ChoiceFieldWidget, ChoiceOption } from "../../../schema/types";

export type ChoiceComponentProps = {
  field: ChoiceFieldWidget;
  options: ChoiceOption[];
  label: string;
};
