import { Stack } from "@mui/material";
import * as sx from "./Logo.styles";

const Logo = () => (
  <Stack direction="row" sx={sx.root}>
    <span aria-hidden>🚀</span>
    <span>React Form Builder</span>
  </Stack>
);

export default Logo;
