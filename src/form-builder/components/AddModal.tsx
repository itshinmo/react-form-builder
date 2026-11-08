import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import * as React from "react";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { useFormStateManager } from "../state";
import type { AddTarget } from "../modals/types";
import { createNewPage, createNewWidget } from "../transformers";
import NewWidgetSection from "./NewWidgetSection";
import { PageSettings } from "./settings";

type Props = {
  item: AddTarget;
  open: boolean;
  onClose: () => void;
  onCloseFinish: () => void;
};

const AddModal = (props: Props) => {
  const { onClose, onCloseFinish, open, item } = props;

  const formStateManager = useFormStateManager();

  const form = useForm<FieldValues>({ mode: "all" });
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);

  if (!formStateManager) return null;

  const { addActions } = formStateManager;

  const title =
    item.type === "page"
      ? "Adding a new page to the form"
      : `Adding a new widget to ${item.parent.title}`;

  const submitForm: SubmitHandler<FieldValues> = data => {
    if (item.type === "page") {
      addActions.addPage(createNewPage(data));
    } else {
      addActions.addWidget(createNewWidget(data, item.parent.id));
    }

    onClose();
  };

  const renderContent = () =>
    item.type === "page" ? <PageSettings /> : <NewWidgetSection />;

  return (
    <form
      onSubmit={event => {
        void form.handleSubmit(submitForm)(event);
      }}
      noValidate
    >
      <button
        ref={submitButtonRef}
        type="submit"
        tabIndex={-1}
        aria-hidden
        style={{ display: "none" }}
      />

      <Dialog
        fullWidth
        open={open}
        onClose={onClose}
        aria-labelledby="add-dialog-title"
        onTransitionExited={onCloseFinish}
        maxWidth="sm"
      >
        <DialogTitle id="add-dialog-title">{title}</DialogTitle>

        <FormProvider {...form}>
          <DialogContent>{renderContent()}</DialogContent>
        </FormProvider>

        <DialogActions>
          <Button color="inherit" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            type="button"
            onClick={() => submitButtonRef.current?.click()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AddModal;
