import * as React from "react";
import type { ChoiceOption, Effect } from "form-engine";

type EffectEditorData = {
  allEffects: Effect[];
  setAllEffects: React.Dispatch<React.SetStateAction<Effect[]>>;
  allFieldWidgetOptions: ChoiceOption[];
};

const Context = React.createContext<EffectEditorData | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  effectEditorData: EffectEditorData;
};

export const EffectEditorDataProvider = (props: ProviderProps) => {
  const { children, effectEditorData } = props;

  return (
    <Context.Provider value={effectEditorData}>{children}</Context.Provider>
  );
};

export const useEffectEditorData = () => React.useContext(Context);
