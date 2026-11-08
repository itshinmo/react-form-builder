import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useSchema } from "../schema-provider";
import { getVisibleFieldData } from "../schema/effects";
import type { FieldData } from "../schema/types";
import { useSchemaStateManager } from "../state";
import type { SystemSx } from "shared/types";

type Props = {
  sx?: SystemSx;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const BackButton = (props: Props) => {
  const { onClick, sx } = props;

  const form = useFormContext();
  const schema = useSchema();
  const stateManager = useSchemaStateManager();

  if (!schema || !stateManager) return null;

  const { state, goToPage, setPageData } = stateManager;

  const previousPageId = state.visitedPages.at(-1) ?? schema.pageIds[0];
  const isDisabled =
    previousPageId === undefined || previousPageId === state.currentPage;

  const handleClick: Props["onClick"] = event => {
    onClick?.(event);

    if (isDisabled) return;

    setPageData(
      state.currentPage,
      getVisibleFieldData(form.getValues() as FieldData, state.visibleWidgets),
    );
    goToPage(previousPageId, true);
  };

  return (
    <Button
      disabled={isDisabled}
      onClick={handleClick}
      sx={sx}
      variant="outlined"
    >
      Back
    </Button>
  );
};

export default BackButton;
