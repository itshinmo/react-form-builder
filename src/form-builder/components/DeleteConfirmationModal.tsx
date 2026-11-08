import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import { useFormStateManager } from "../state";
import type { FormItem } from "../types";
import { getItemTitle, isPageNode } from "../utils";

type Props = {
  item: FormItem;
  open: boolean;
  onClose: () => void;
  onCloseFinish: () => void;
};

const DeleteConfirmationModal = (props: Props) => {
  const { onClose, onCloseFinish, open, item } = props;

  const formStateManager = useFormStateManager();

  if (!formStateManager) return null;

  const { removeActions } = formStateManager;

  const title = `Delete "${getItemTitle(item)}"`;

  const description = isPageNode(item)
    ? "Are you sure you want to delete this page and all of its widgets?"
    : "Are you sure you want to delete this widget?";

  const handleAcceptClick = () => {
    onClose();

    if (isPageNode(item)) {
      removeActions.removePage(item.id);
    } else {
      removeActions.removeWidget(item.id);
    }
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      onTransitionExited={onCloseFinish}
      maxWidth="xs"
    >
      <DialogTitle id="delete-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{description}</DialogContentText>

        <FormHelperText error>
          Effects that reference this item will be removed.
        </FormHelperText>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="contained" color="error" onClick={handleAcceptClick}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
