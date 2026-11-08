import type { SxProps, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";

const mergeSx =
  (...sxList: (SxProps<Theme> | undefined)[]) =>
  (theme: Theme) => {
    const mergedSx = sxList.reduce((result, currentSx) => {
      const sx =
        typeof currentSx === "function" ? currentSx(theme) : currentSx ?? {};

      return { ...result, ...sx };
    }, {}) as SystemStyleObject<Theme>;

    return mergedSx;
  };

export default mergeSx;
