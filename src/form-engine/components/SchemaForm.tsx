import type { ReactNode } from "react";
import { useFormContext, type SubmitHandler } from "react-hook-form";
import { useSchema } from "../schema-provider";
import {
  getPageEffects,
  getVisibleFieldData,
  getVisiblePageData,
  isEffectTriggered,
} from "../schema/effects";
import type { FieldData, PageData } from "../schema/types";
import { useSchemaStateManager } from "../state";
import SchemaRenderer from "./SchemaRenderer";

type Props = {
  submitButton: ReactNode;
  onSubmit: (formData: FieldData) => void;
};

const SchemaForm = (props: Props) => {
  const { submitButton, onSubmit } = props;

  const form = useFormContext();
  const schema = useSchema();
  const stateManager = useSchemaStateManager();

  if (!schema || !stateManager) return null;

  const { state, goToPage, setPageData } = stateManager;
  const { currentPage, visibleWidgets } = state;

  const submitForm: SubmitHandler<FieldData> = formValues => {
    const currentPageData = getVisibleFieldData(formValues, visibleWidgets);

    setPageData(currentPage, currentPageData);

    const pageData: PageData = {
      ...state.pageData,
      [currentPage]: currentPageData,
    };

    const triggeredPageEffect = getPageEffects(currentPage, schema).find(
      effect =>
        isEffectTriggered(effect.fn, currentPageData) &&
        Boolean(schema.definitions.pages[effect.action.pageId]),
    );

    if (triggeredPageEffect) {
      goToPage(triggeredPageEffect.action.pageId);

      return;
    }

    const completedPageIds = Array.from(
      new Set([...state.visitedPages, currentPage]),
    );

    onSubmit(getVisiblePageData(schema, completedPageIds, pageData));
  };

  return (
    <form
      onSubmit={event => {
        void form.handleSubmit(submitForm)(event);
      }}
      noValidate
    >
      <SchemaRenderer />
      {submitButton}
    </form>
  );
};

export default SchemaForm;
