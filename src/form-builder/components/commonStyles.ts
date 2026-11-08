import type { SystemSx } from "shared/types";

export const fieldset: SystemSx = theme => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 0.25,
  margin: theme.spacing(2, 0, 0),
  width: "100%",
  minWidth: "unset",
  boxSizing: "border-box",
});

export const fieldsetLegend: SystemSx = theme => ({
  padding: theme.spacing(0, 0.5),
});

export const input: SystemSx = theme => ({
  marginTop: theme.spacing(1),
});

export const formControl: SystemSx = theme => ({
  marginTop: theme.spacing(0.5),

  "& + &": {
    marginTop: theme.spacing(2),
  },
});

export const fieldDescription: SystemSx = theme => ({
  marginTop: theme.spacing(0.5),
});

export const switchInput: SystemSx = {
  justifyContent: "space-between",
  margin: 0,
};

export const divider: SystemSx = theme => ({
  margin: theme.spacing(2, 0),
});
