import type { SystemSx } from "shared/types";

export const root: SystemSx = theme => ({
  gap: theme.spacing(1),
  ...theme.typography.h6,
  fontWeight: theme.typography.fontWeightMedium,
});
