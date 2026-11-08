import type { SystemSx } from "shared/types";

export const root: SystemSx = theme => ({
  padding: theme.spacing(0, 2),
  boxShadow: `0 -2px 0 0 ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  zIndex: theme.zIndex.appBar,
});

export const buttonWrapper: SystemSx = theme => ({
  maxWidth: theme.typography.pxToRem(512),
  height: "100%",
  margin: "auto",
});

export const backButton: SystemSx = {
  marginRight: "auto",
};

export const submitButton: SystemSx = {
  marginLeft: "auto",
};
