import { Button } from "@mui/material";
import type { SystemSx } from "shared/types";

type Props = {
  text: string;
  sx?: SystemSx;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const SubmitButton = (props: Props) => {
  const { sx, text, onClick } = props;

  return (
    <Button sx={sx} variant="contained" type="button" onClick={onClick}>
      {text}
    </Button>
  );
};

export default SubmitButton;
