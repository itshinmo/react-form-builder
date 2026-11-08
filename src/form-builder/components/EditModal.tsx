import {
  AutoAwesome as AutoAwesomeIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
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
import type { Effect, SchemaId } from "form-engine";
import { useFormStateManager } from "../state";
import { createEditPageProps, createWidgetDefinition } from "../transformers";
import type { FormItem, TabState, WidgetNode } from "../types";
import { getItemTitle, isPageNode, renderChip } from "../utils";
import { EffectsEditor } from "./effects";
import { EditModalItemProvider } from "./EditModalItemContext";
import PageTabs from "./PageTabs";
import SettingsEditor from "./SettingsEditor";
import { generateEffectFieldValues } from "./effects/utils";

type Props = {
  item: FormItem;
  open: boolean;
  onClose: () => void;
  onCloseFinish: () => void;
};

const getWidgetFormValues = (widget: WidgetNode): FieldValues => {
  const values = { ...widget } as Record<string, unknown>;

  delete values.id;
  delete values.pageId;
  delete values.kind;
  delete values.type;

  return values as FieldValues;
};

const getPageFormValues = (
  title: string,
  effectIds: SchemaId[],
  effects: Record<SchemaId, Effect> | undefined,
): FieldValues => {
  const values: FieldValues = { title };

  for (const effectId of effectIds) {
    const effect = effects?.[effectId];

    if (!effect) continue;

    Object.assign(values, generateEffectFieldValues(effect));
  }

  return values;
};

const EditModal = (props: Props) => {
  const { onClose, onCloseFinish, open, item } = props;

  const formStateManager = useFormStateManager();
  const effectsById = formStateManager?.state.effects.byId;

  const submitButtonRef = React.useRef<HTMLButtonElement>(null);

  const defaultValues = React.useMemo<FieldValues>(() => {
    if (isPageNode(item)) {
      return getPageFormValues(item.title, item.effectIds, effectsById);
    }

    return getWidgetFormValues(item);
  }, [effectsById, item]);

  const form = useForm<FieldValues>({ mode: "all", defaultValues });

  if (!formStateManager) return null;

  const { editActions } = formStateManager;

  const submitForm: SubmitHandler<FieldValues> = data => {
    if (isPageNode(item)) {
      const { title, effects } = createEditPageProps(data, item);

      editActions.editPage(item.id, title, effects);
    } else {
      editActions.editWidget(item.id, createWidgetDefinition(data, item.type));
    }

    onClose();
  };

  const renderDialogContent = () => {
    if (!isPageNode(item)) return <SettingsEditor item={item} />;

    const tabs: TabState[] = [
      {
        name: "settings",
        icon: <SettingsIcon fontSize="small" />,
        tabContent: <SettingsEditor item={item} />,
      },
      {
        name: "effects",
        icon: <AutoAwesomeIcon fontSize="small" />,
        tabContent: <EffectsEditor page={item} />,
      },
    ];

    return <PageTabs tabs={tabs} />;
  };

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
        onClose={onClose}
        open={open}
        aria-labelledby="edit-dialog-title"
        onTransitionExited={onCloseFinish}
        maxWidth="md"
        scroll="paper"
      >
        <FormProvider {...form}>
          <EditModalItemProvider item={item}>
            <DialogTitle
              id="edit-dialog-title"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              Editing {getItemTitle(item)}
              {renderChip(item)}
            </DialogTitle>

            <DialogContent sx={{ paddingTop: 0, overflowX: "hidden" }} dividers>
              {renderDialogContent()}
            </DialogContent>

            <DialogActions>
              <Button color="inherit" onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="button"
                variant="contained"
                onClick={() => submitButtonRef.current?.click()}
              >
                Save
              </Button>
            </DialogActions>
          </EditModalItemProvider>
        </FormProvider>
      </Dialog>
    </form>
  );
};

export default EditModal;
