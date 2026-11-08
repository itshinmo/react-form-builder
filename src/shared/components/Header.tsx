import { Stack } from "@mui/material";
import type { SystemSx } from "shared/types";
import { mergeSx } from "shared/utils";
import Logo from "./Logo";
import * as sx from "./Header.styles";

type Props = {
  sx?: SystemSx;
};

const Header = (props: Props) => {
  const { sx: sxProp } = props;

  return (
    <Stack sx={mergeSx(sx.root, sxProp)} direction="row" alignItems="center">
      <Logo />
    </Stack>
  );
};

export default Header;
