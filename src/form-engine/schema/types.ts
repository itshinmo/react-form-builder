import type {
  ComparisonType,
  FieldActionType,
  LogicalType,
  PageActionType,
} from "./constants";

/** Unique identifier for any schema entity. */
export type SchemaId = string;

/** Values of the fields on one page, keyed by widget id. */
export type FieldData = Record<SchemaId, unknown>;

/** Field values of all pages, keyed by page id. */
export type PageData = Record<SchemaId, FieldData>;

type WidgetBase = {
  id: SchemaId;
  pageId: SchemaId;
};

type CommonFieldWidgetProps = {
  label: string;
  description?: string;
  required?: boolean;
};

type CommonUiWidgetProps = {
  /**
   * Only used in the builder to identify the widget (for example when
   * connecting effects). UI widgets are not rendered with a visible label.
   */
  label: string;
};

// ---------------------------------------------------------------------------
// Field widgets
// ---------------------------------------------------------------------------

export type StringFieldWidget = WidgetBase &
  CommonFieldWidgetProps & {
    kind: "field";
    type: "string";
    inputType: "text" | "email";
    placeholder?: string;
    multiline?: boolean;
    maxLength?: number;
    minLength?: number;
    defaultValue?: string;
  };

export type NumberFieldWidget = WidgetBase &
  CommonFieldWidgetProps & {
    kind: "field";
    type: "number";
    placeholder?: string;
    max?: number;
    min?: number;
    defaultValue?: number;
  };

export type BooleanFieldWidget = WidgetBase &
  CommonFieldWidgetProps & {
    kind: "field";
    type: "boolean";
    defaultChecked: boolean;
  };

export type ChoiceOption = {
  label: string;
  value: string;
};

export type ChoiceFieldWidget = WidgetBase &
  CommonFieldWidgetProps & {
    kind: "field";
    type: "choice";
    minRequired?: number;
    maxRequired?: number;
    shuffleOptions?: boolean;
    multiSelect: boolean;
    defaultValue?: string | string[];
    options: ChoiceOption[];
  };

export type FieldWidget =
  | StringFieldWidget
  | NumberFieldWidget
  | BooleanFieldWidget
  | ChoiceFieldWidget;

// ---------------------------------------------------------------------------
// UI widgets
// ---------------------------------------------------------------------------

export type TextWidget = WidgetBase &
  CommonUiWidgetProps & {
    kind: "ui";
    type: "text";
    text: string;
    variant: "paragraph" | "title" | "subtitle";
  };

export type LinkWidget = WidgetBase &
  CommonUiWidgetProps & {
    kind: "ui";
    type: "link";
    href: string;
    text: string;
  };

export type DividerWidget = WidgetBase &
  CommonUiWidgetProps & {
    kind: "ui";
    type: "divider";
  };

export type UIWidget = TextWidget | LinkWidget | DividerWidget;

export type Widget = FieldWidget | UIWidget;

/** A widget without its identity, used when creating/editing widgets. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type WidgetDefinition = DistributiveOmit<Widget, "id" | "pageId">;

export type FieldWidgetType = FieldWidget["type"];
export type UIWidgetType = UIWidget["type"];
export type WidgetType = Widget["type"];
export type WidgetKind = Widget["kind"];

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export type PageSchema = {
  id: SchemaId;
  title: string;
  widgetIds: SchemaId[];
  effectIds: SchemaId[];
};

// ---------------------------------------------------------------------------
// Effects
// ---------------------------------------------------------------------------

export type ComparisonFn = {
  type: ComparisonType;
  fieldId: SchemaId;
  value: unknown;
};

export type LogicalFn = {
  type: LogicalType;
  operands: [ComparisonFn, ComparisonFn];
};

/** A condition that is always true. */
export type AlwaysFn = {
  type: "ALWAYS";
};

export type Fn = ComparisonFn | LogicalFn | AlwaysFn;

export type FieldEffect = {
  id: SchemaId;
  owner: SchemaId;
  type: "field";
  fn: Fn;
  action: {
    type: FieldActionType.HIDE_WIDGETS;
    widgetIds: SchemaId[];
  };
};

export type PageEffect = {
  id: SchemaId;
  owner: SchemaId;
  type: "page";
  fn: Fn;
  action: {
    type: PageActionType.GO_TO_PAGE;
    pageId: SchemaId;
  };
};

export type Effect = FieldEffect | PageEffect;
export type EffectType = Effect["type"];
export type EffectAction = Effect["action"];

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

export type DocumentSchema = {
  pageIds: SchemaId[];
  submitButtonText: string;
  definitions: {
    pages: Record<SchemaId, PageSchema>;
    widgets: Record<SchemaId, Widget>;
    effects: Record<SchemaId, Effect>;
  };
};
