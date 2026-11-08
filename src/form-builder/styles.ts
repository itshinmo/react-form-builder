import type { SystemSx } from "shared/types";

export const root: SystemSx = {
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
};

export const header: SystemSx = theme => ({
  width: "100%",
  height: theme.spacing(6),
});

export const editor: SystemSx = theme => ({
  width: "100%",
  height: `calc(100% - ${theme.spacing(6)})`,
});

export const chip: SystemSx = theme => ({
  marginRight: theme.spacing(1),
  cursor: "inherit",
});
