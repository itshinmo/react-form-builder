import {
  Add as AddIcon,
  Delete as DeleteIcon,
  SettingsSuggest as SettingsSuggestIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useModalManager } from "../modals";
import type { FormItem } from "../types";
import { getItemTitle, isPageNode, renderChip } from "../utils";

type Props = {
  item: FormItem;
};

const FormHierarchyItem = (props: Props) => {
  const { item } = props;

  const modalManager = useModalManager();

  if (!modalManager) return null;

  const { addModal, deleteModal, editModal } = modalManager;

  const handleAddClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();

    if (isPageNode(item)) {
      addModal.open({ type: "widget", parent: item });
    }
  };

  const handleDeleteClick: React.MouseEventHandler<
    HTMLButtonElement
  > = event => {
    event.stopPropagation();
    deleteModal.open(item);
  };

  const handleEditClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();
    editModal.open(item);
  };

  return (
    <Stack direction="row" alignItems="center" sx={{ userSelect: "none" }}>
      {renderChip(item)}

      <Typography variant="body1">{getItemTitle(item)}</Typography>

      <Stack direction="row" spacing={1} sx={{ marginLeft: "auto" }}>
        {isPageNode(item) && (
          <IconButton
            aria-label="add widget"
            size="small"
            onClick={handleAddClick}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        )}

        <IconButton aria-label="edit" size="small" onClick={handleEditClick}>
          <SettingsSuggestIcon fontSize="small" />
        </IconButton>

        <IconButton
          aria-label="delete"
          size="small"
          onClick={handleDeleteClick}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default FormHierarchyItem;
