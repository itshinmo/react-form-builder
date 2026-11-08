import { Accordion, AccordionDetails } from "@mui/material";
import type { Effect } from "form-engine";
import ActionSection from "./ActionSection";
import EffectAccordionHeader from "./EffectAccordionHeader";
import FnSection from "./FnSection";

type Props = {
  effect: Effect;
  expanded: boolean;
  onToggle: () => void;
};

const EffectAccordion = (props: Props) => {
  const { effect, expanded, onToggle } = props;

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      TransitionProps={{ unmountOnExit: true }}
    >
      <EffectAccordionHeader effect={effect} />

      <AccordionDetails>
        <ActionSection effect={effect} />
        <FnSection
          fn={effect.fn}
          effectId={effect.id}
          effectType={effect.type}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default EffectAccordion;
