import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import * as React from "react";
import type { SystemSx } from "shared/types";
import { mergeSx } from "shared/utils";
import { useModalManager } from "../modals";
import { useFormStateManager } from "../state";
import type { PageNode } from "../types";
import FormHierarchyItem from "./FormHierarchyItem";

type Props = {
  sx?: SystemSx;
};

const EMPTY_PAGE_IDS: string[] = [];

const FormHierarchy = (props: Props) => {
  const { sx: sxProps } = props;

  const formStateManager = useFormStateManager();
  const modalManager = useModalManager();

  const currentPageIds = formStateManager?.state.pages.allIds ?? EMPTY_PAGE_IDS;

  const [expandedItems, setExpandedItems] =
    React.useState<string[]>(currentPageIds);

  /**
   * Keep expansion state in sync with page additions/removals. This used to
   * call setState during render, which could trigger React warnings and
   * unnecessary extra renders.
   */
  React.useEffect(() => {
    setExpandedItems(previous => {
      const currentIds = new Set(currentPageIds);
      const next = previous.filter(pageId => currentIds.has(pageId));

      for (const pageId of currentPageIds) {
        if (!next.includes(pageId)) next.push(pageId);
      }

      const isUnchanged =
        next.length === previous.length &&
        next.every((pageId, index) => pageId === previous[index]);

      return isUnchanged ? previous : next;
    });
  }, [currentPageIds]);

  const togglePage = (pageId: string) => {
    setExpandedItems(current =>
      current.includes(pageId)
        ? current.filter(id => id !== pageId)
        : [...current, pageId],
    );
  };

  const renderWidgets = (page: PageNode) => {
    if (!formStateManager) return null;

    const { widgets } = formStateManager.state;

    return page.widgetIds.map(widgetId => {
      const widget = widgets.byId[widgetId];

      if (!widget) return null;

      return (
        <TreeItem
          key={widget.id}
          nodeId={widget.id}
          label={<FormHierarchyItem item={widget} />}
        />
      );
    });
  };

  if (!formStateManager || !modalManager) return null;

  const { state } = formStateManager;
  const { addModal } = modalManager;

  return (
    <Box
      sx={mergeSx(
        { borderRight: 1, borderColor: "divider", overflowY: "auto" },
        sxProps,
      )}
    >
      <Stack direction="column" justifyContent="center">
        <Button onClick={() => addModal.open({ type: "page" })}>
          <AddIcon fontSize="inherit" />
          Create new Page
        </Button>

        <TreeView
          expanded={expandedItems}
          onNodeToggle={(_event, nodeIds) => setExpandedItems(nodeIds)}
          aria-label="form-tree-view"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {state.pages.allIds.map(pageId => {
            const page = state.pages.byId[pageId];

            return page ? (
              <TreeItem
                key={pageId}
                nodeId={pageId}
                label={
                  <Box onClick={() => togglePage(pageId)}>
                    <FormHierarchyItem item={page} />
                  </Box>
                }
              >
                {renderWidgets(page)}
              </TreeItem>
            ) : null;
          })}
        </TreeView>
      </Stack>
    </Box>
  );
};

export default FormHierarchy;
