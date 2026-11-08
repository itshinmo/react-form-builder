import { Box, Chip, Typography } from "@mui/material";
import type { SystemSx } from "shared/types";
import { mergeSx } from "shared/utils";
import * as formSx from "./components/commonStyles";
import * as sx from "./styles";
import type { FormItem, PageNode, WidgetNode } from "./types";

export const isPageNode = (item: FormItem): item is PageNode =>
  item.type === "page";

export const isFieldWidgetNode = (
  widget: WidgetNode,
): widget is Extract<WidgetNode, { kind: "field" }> => widget.kind === "field";

export const getItemTitle = (item: FormItem): string =>
  isPageNode(item) ? item.title : item.label;

export const getWidgetTypeLabel = (widget: WidgetNode): string =>
  widget.kind === "field"
    ? `FIELD: ${widget.type.toUpperCase()}`
    : `UI: ${widget.type.toUpperCase()}`;

export const renderChip = (item: FormItem) => {
  if (isPageNode(item)) {
    return (
      <Chip
        label="PAGE"
        color="primary"
        variant="outlined"
        size="small"
        sx={sx.chip}
      />
    );
  }

  return (
    <Chip
      label={getWidgetTypeLabel(item)}
      color={item.kind === "field" ? "secondary" : "warning"}
      variant="outlined"
      size="small"
      sx={sx.chip}
    />
  );
};

type FieldsetProps = {
  title: string;
  children?: React.ReactNode;
  sx?: SystemSx;
};

export const Fieldset = (props: FieldsetProps) => {
  const { children, title, sx: sxProp } = props;

  return (
    <Box sx={mergeSx(formSx.fieldset, sxProp)} component="fieldset">
      <Typography
        sx={formSx.fieldsetLegend}
        component="legend"
        variant="subtitle2"
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
};
