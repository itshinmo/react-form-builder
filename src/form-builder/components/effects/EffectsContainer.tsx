import { Stack } from "@mui/material";
import * as React from "react";
import type { Effect, SchemaId } from "form-engine";
import { Fieldset } from "../../utils";
import EffectAccordion from "./EffectAccordion";

type Props = {
  effects: Effect[];
};

const EffectsContainer = (props: Props) => {
  const { effects } = props;

  const [expandedAccordion, setExpandedAccordion] =
    React.useState<SchemaId | null>(null);

  const handleAccordionToggle = (effectId: SchemaId) => {
    setExpandedAccordion(current => (current === effectId ? null : effectId));
  };

  return (
    <Fieldset title="All Effects">
      <Stack direction="column" justifyContent="center">
        {effects.map(effect => (
          <EffectAccordion
            key={effect.id}
            effect={effect}
            expanded={expandedAccordion === effect.id}
            onToggle={() => handleAccordionToggle(effect.id)}
          />
        ))}
      </Stack>
    </Fieldset>
  );
};

export default EffectsContainer;
