import type { SystemSx } from "shared/types";

export const root: SystemSx = {
  height: "100%",
};

export const formHierarchy: SystemSx = theme => ({
  width: theme.spacing(40),
});

export const formPreview: SystemSx = theme => ({
  width: `calc(100% - ${theme.spacing(40)})`,
});
