import type { SystemSx } from "shared/types";

export const root: SystemSx = theme => ({
  borderBottom: `2px solid ${theme.palette.divider}`,
  padding: theme.spacing(0, 2),
});
