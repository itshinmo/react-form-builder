import { Box, Stack } from "@mui/material";
import type { ReactNode } from "react";
import type { SystemSx } from "shared/types";
import { mergeSx } from "shared/utils";
import * as sx from "./Footer.styles";

type Props = {
  sx?: SystemSx;
  submitButton?: ReactNode;
  backButton?: ReactNode;
  children?: ReactNode;
};

const Footer = (props: Props) => {
  const { sx: sxProp, submitButton, backButton, children } = props;

  return (
    <Box component="footer" sx={mergeSx(sx.root, sxProp)}>
      <Stack sx={sx.buttonWrapper} alignItems="center" direction="row">
        {backButton}
        {children}
        {submitButton}
      </Stack>
    </Box>
  );
};

export default Footer;
