import { Card } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

const NodeCard = (props: Props) => {
  const { children } = props;

  return (
    <Card sx={{ padding: 0.75 }} variant="outlined">
      {children}
    </Card>
  );
};

export default NodeCard;
