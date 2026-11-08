import { Typography } from "@mui/material";
import type { TextWidget as TextWidgetProps } from "../../schema/types";

const TextWidget = (props: TextWidgetProps) => {
  const { text, variant } = props;

  switch (variant) {
    case "paragraph":
      return <Typography variant="body1">{text}</Typography>;

    case "title":
      return (
        <Typography component="strong" variant="h6">
          {text}
        </Typography>
      );

    case "subtitle":
      return (
        <Typography component="strong" variant="subtitle2">
          {text}
        </Typography>
      );

    default:
      return null;
  }
};

export default TextWidget;
