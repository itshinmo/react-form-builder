import { Stack } from "@mui/material";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { ChoiceOption } from "form-engine";
import { useFormStateManager } from "../../state";
import type { PageNode } from "../../types";
import { isFieldWidgetNode } from "../../utils";
import { getEffectsFromFormValues } from "./utils";
import CreateEffectSection from "./CreateEffectSection";
import EffectsContainer from "./EffectsContainer";
import { EffectEditorDataProvider } from "./effect-context";

type Props = {
  page: PageNode;
};

const EffectsEditor = (props: Props) => {
  const { page } = props;

  const formStateManager = useFormStateManager();
  const { getValues } = useFormContext();

  const [allEffects, setAllEffects] = React.useState(() =>
    getEffectsFromFormValues(page.id, getValues()),
  );

  const allFieldWidgetOptions = React.useMemo<ChoiceOption[]>(() => {
    if (!formStateManager) return [];

    const { state } = formStateManager;

    return page.widgetIds.flatMap(widgetId => {
      const widget = state.widgets.byId[widgetId];

      if (!widget || !isFieldWidgetNode(widget)) return [];

      return [{ value: widgetId, label: widget.label }];
    });
  }, [formStateManager, page.widgetIds]);

  if (!formStateManager) return null;

  return (
    <Stack
      justifyContent="center"
      direction="column"
      marginTop={2}
      marginBottom={2}
    >
      <EffectEditorDataProvider
        effectEditorData={{
          allEffects,
          setAllEffects,
          allFieldWidgetOptions,
        }}
      >
        <CreateEffectSection />

        {allEffects.length > 0 && <EffectsContainer effects={allEffects} />}
      </EffectEditorDataProvider>
    </Stack>
  );
};

export default EffectsEditor;
