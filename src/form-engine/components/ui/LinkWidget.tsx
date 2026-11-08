import { Link } from "@mui/material";
import type { LinkWidget as LinkWidgetProps } from "../../schema/types";

const LinkWidget = (props: LinkWidgetProps) => {
  const { href, text } = props;

  return (
    <Link variant="body2" href={href} target="_blank" rel="noopener noreferrer">
      {text}
    </Link>
  );
};

export default LinkWidget;
