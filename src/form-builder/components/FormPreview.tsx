import { Box, Stack } from "@mui/material";
import { Form } from "form-engine/components";
import type { DocumentSchema, PageSchema } from "form-engine/schema/types";
import * as React from "react";
import type { SystemSx } from "shared/types";
import { mergeSx } from "shared/utils";
import { useFormStateManager } from "../state";

type Props = {
  sx?: SystemSx;
};

const FormPreview = (props: Props) => {
  const { sx: sxProps } = props;

  const stateManager = useFormStateManager();

  const schema = React.useMemo<DocumentSchema | null>(() => {
    if (!stateManager) return null;

    const { state } = stateManager;

    const pages: Record<string, PageSchema> = {};

    for (const pageId of state.pages.allIds) {
      const page = state.pages.byId[pageId];

      if (!page) continue;

      pages[pageId] = {
        id: page.id,
        title: page.title,
        widgetIds: page.widgetIds,
        effectIds: page.effectIds,
      };
    }

    return {
      pageIds: state.pages.allIds,
      submitButtonText: "Submit",
      definitions: {
        pages,
        widgets: state.widgets.byId,
        effects: state.effects.byId,
      },
    };
  }, [stateManager]);

  if (!stateManager) return null;

  if (stateManager.state.pages.allIds.length === 0) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={mergeSx(
          { height: "100%", borderLeft: 1, borderColor: "divider" },
          sxProps,
        )}
      >
        <h3>No pages yet</h3>
        <p>Create a page in the editor to preview the form.</p>
      </Stack>
    );
  }

  if (!schema) return null;

  return (
    <Box
      sx={mergeSx(
        { height: "100%", borderLeft: 1, borderColor: "divider" },
        sxProps,
      )}
    >
      <Form schema={schema} />
    </Box>
  );
};

export default FormPreview;
