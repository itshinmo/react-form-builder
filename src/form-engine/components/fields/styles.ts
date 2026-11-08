import type { SystemSx } from "shared/types";

export const fieldWidget: SystemSx = theme => ({
  "& > [data-slot='description']": {
    marginBottom: theme.spacing(2),
  },
});
