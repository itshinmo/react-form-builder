import { Box, Button, Stack } from "@mui/material";
import { Footer } from "shared/components";
import * as React from "react";
import {
  FormProvider,
  type FieldValues,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { SchemaProvider, useSchema } from "../schema-provider";
import { getTriggeredPageEffect, getVisibleFieldData } from "../schema/effects";
import type { DocumentSchema, FieldData } from "../schema/types";
import { SchemaStateManager, useSchemaStateManager } from "../state";
import { getSchemaDefaultValues } from "../defaults";
import BackButton from "./BackButton";
import FormTable from "./FormTable";
import SchemaForm from "./SchemaForm";
import SubmitButton from "./SubmitButton";
import * as sx from "./Form.styles";

type Props = {
  schema: DocumentSchema;
};

type FormContentProps = {
  defaultValues: FieldData;
  result: FieldData | null;
  setResult: (result: FieldData | null) => void;
};

const FormContent = (props: FormContentProps) => {
  const { defaultValues, result, setResult } = props;

  const form = useFormContext();
  const schema = useSchema();
  const stateManager = useSchemaStateManager();

  const watchedValues = (useWatch({ control: form.control }) ??
    {}) as FieldData;

  const submitButtonRef = React.useRef<HTMLButtonElement>(null);

  if (!stateManager) return null;

  const currentPageData = getVisibleFieldData(
    watchedValues,
    stateManager.state.visibleWidgets,
  );

  const triggeredPageEffect = schema
    ? getTriggeredPageEffect(
        schema,
        stateManager.state.currentPage,
        currentPageData,
      )
    : undefined;

  const submitButtonText = triggeredPageEffect
    ? "Next"
    : schema?.submitButtonText ?? "Submit";

  const handleSubmitClick = () => {
    submitButtonRef.current?.click();
  };

  const handleResetClick = () => {
    form.reset(defaultValues);
    stateManager.reset();
    setResult(null);
  };

  if (result !== null) {
    return (
      <>
        <FormTable data={result} />

        <Footer sx={sx.footer}>
          <Button variant="contained" onClick={handleResetClick}>
            Reset
          </Button>
        </Footer>
      </>
    );
  }

  return (
    <>
      <Box sx={sx.main} component="main">
        <SchemaForm
          onSubmit={setResult}
          submitButton={
            <button
              ref={submitButtonRef}
              type="submit"
              tabIndex={-1}
              aria-hidden
              style={{ display: "none" }}
            />
          }
        />
      </Box>

      <Footer
        sx={sx.footer}
        submitButton={
          <SubmitButton
            sx={sx.submitButton}
            text={submitButtonText}
            onClick={handleSubmitClick}
          />
        }
        backButton={<BackButton sx={sx.backButton} />}
      />
    </>
  );
};

/**
 * Renders a complete, schema-driven form (pages, widgets, effects, result).
 */
const Form = (props: Props) => {
  const { schema } = props;

  const defaultValues = React.useMemo(
    () => getSchemaDefaultValues(schema),
    [schema],
  );

  const form = useForm({
    mode: "all",
    defaultValues: defaultValues as FieldValues,
  });

  const [result, setResult] = React.useState<FieldData | null>(null);

  // A schema edit should take the preview back to the form view without
  // discarding the values the user already entered.
  React.useEffect(() => {
    setResult(null);
  }, [schema]);

  return (
    <Stack direction="column" sx={sx.wrapper}>
      <SchemaProvider schema={schema}>
        <FormProvider {...form}>
          <SchemaStateManager>
            <FormContent
              defaultValues={defaultValues}
              result={result}
              setResult={setResult}
            />
          </SchemaStateManager>
        </FormProvider>
      </SchemaProvider>
    </Stack>
  );
};

export default Form;
