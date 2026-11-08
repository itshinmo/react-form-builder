import { useSchema } from "../schema-provider";
import type { Widget } from "../schema/types";
import { useSchemaStateManager } from "../state";
import { BooleanField, ChoiceField, NumberField, StringField } from "./fields";
import SchemaPage from "./SchemaPage";
import { DividerWidget, LinkWidget, TextWidget } from "./ui";

export const renderWidget = (widget: Widget) => {
  switch (widget.type) {
    case "string":
      return <StringField key={widget.id} {...widget} />;

    case "number":
      return <NumberField key={widget.id} {...widget} />;

    case "boolean":
      return <BooleanField key={widget.id} {...widget} />;

    case "choice":
      return <ChoiceField key={widget.id} {...widget} />;

    case "text":
      return <TextWidget key={widget.id} {...widget} />;

    case "link":
      return <LinkWidget key={widget.id} {...widget} />;

    case "divider":
      return <DividerWidget key={widget.id} />;

    default:
      return null;
  }
};

/**
 * Renders the current page of a schema.
 */
const SchemaRenderer = () => {
  const schema = useSchema();
  const stateManager = useSchemaStateManager();

  if (!schema || !stateManager) return null;

  const { state } = stateManager;
  const page = schema.definitions.pages[state.currentPage];

  if (!page) return null;

  const widgets = state.visibleWidgets.flatMap(widgetId => {
    const widget = schema.definitions.widgets[widgetId];

    return widget ? [renderWidget(widget)] : [];
  });

  return <SchemaPage page={page} widgets={widgets} />;
};

export default SchemaRenderer;
