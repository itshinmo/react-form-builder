import { Stack, Typography } from "@mui/material";
import type { PageSchema } from "../schema/types";
import type { ReactNode } from "react";

type Props = {
  page: PageSchema;
  widgets: ReactNode[];
};

const SchemaPage = (props: Props) => {
  const { page, widgets } = props;

  return (
    <Stack id={`page-${page.id}`} spacing={2}>
      <Typography component="h1" variant="h4">
        {page.title}
      </Typography>

      {widgets}
    </Stack>
  );
};

export default SchemaPage;
