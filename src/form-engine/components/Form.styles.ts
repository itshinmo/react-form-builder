import type { SystemSx } from "shared/types";

export const main: SystemSx = theme => ({
  padding: theme.spacing(2),
  maxWidth: theme.typography.pxToRem(512),
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  marginBottom: "auto",
});

export const footer: SystemSx = theme => ({
  flexShrink: 0,
  width: "100%",
  height: theme.spacing(6),
  position: "sticky",
  bottom: 0,
});

export const wrapper: SystemSx = {
  overflowY: "auto",
  height: "100%",
};

export const submitButton: SystemSx = {
  marginLeft: "auto",
};

export const backButton: SystemSx = {
  marginRight: "auto",
};
