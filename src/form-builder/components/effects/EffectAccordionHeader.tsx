import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  AccordionSummary,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { Effect, EffectType } from "form-engine";
import { useEffectEditorData } from "./effect-context";
import { EFFECT_TYPE } from "../../names";
import { useEffectFieldNames } from "./hooks";

type Props = {
  effect: Effect;
};

const EFFECT_TYPE_LABELS: Record<Effect["type"], string> = {
  field: "Field effect",
  page: "Page effect",
};

const EffectAccordionHeader = (props: Props) => {
  const { effect } = props;

  const { unregister, watch } = useFormContext();
  const { effectErrors, effectFieldNames } = useEffectFieldNames(effect.id);
  const effectEditorData = useEffectEditorData();

  const effectTypeFieldName = effectFieldNames.find(name =>
    name.endsWith(EFFECT_TYPE),
  );
  const effectType =
    ((effectTypeFieldName ? watch(effectTypeFieldName) : undefined) as
      | EffectType
      | undefined) ?? effect.type;

  if (!effectEditorData) return null;

  const { allEffects, setAllEffects } = effectEditorData;

  const handleEffectDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    setAllEffects(
      allEffects.filter(stateEffect => stateEffect.id !== effect.id),
    );

    effectFieldNames.forEach(name => unregister(name));
  };

  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Stack direction="column" width="100%">
        <Stack width="100%" direction="row" alignItems="center" spacing={1}>
          <Typography>{EFFECT_TYPE_LABELS[effectType]}</Typography>

          <Typography
            variant="caption"
            color={effectErrors.length > 0 ? "error" : "text.secondary"}
          >
            {effect.id}
          </Typography>

          <IconButton
            aria-label="Delete effect"
            sx={{ marginLeft: "auto" }}
            onClick={handleEffectDelete}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>

        {effectErrors.length > 0 && (
          <FormHelperText error>This effect has errors.</FormHelperText>
        )}
      </Stack>
    </AccordionSummary>
  );
};

export default EffectAccordionHeader;
