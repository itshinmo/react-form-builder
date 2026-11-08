import { Stack } from "@mui/material";
import type { SystemSx } from "shared/types";
import { mergeSx } from "shared/utils";
import { useFormStateManager } from "../state";
import FormHierarchy from "./FormHierarchy";
import FormPreview from "./FormPreview";
import * as sx from "./FormEditor.styles";

type Props = {
  sx?: SystemSx;
};

const FormEditor = (props: Props) => {
  const { sx: sxProps } = props;

  const stateManager = useFormStateManager();

  if (!stateManager) return null;

  return (
    <Stack
      sx={mergeSx(sx.root, sxProps)}
      direction="row"
      justifyContent="space-between"
    >
      <FormHierarchy sx={sx.formHierarchy} />
      <FormPreview sx={sx.formPreview} />
    </Stack>
  );
};

export default FormEditor;
