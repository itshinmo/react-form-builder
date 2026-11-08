import { describe, expect, it } from "vitest";
import {
  ComparisonType,
  FieldActionType,
  LogicalType,
  PageActionType,
  type Effect,
} from "form-engine";
import {
  createEditPageProps,
  createNewPage,
  createNewWidget,
  createWidgetDefinition,
} from "./transformers";
import { createPage } from "test/factories";
import {
  generateEffectFieldValues,
  getEffectIds,
  getEffectsFromFormValues,
} from "./components/effects/utils";

describe("createNewPage", () => {
  it("creates an empty page with a prefixed id and trimmed title", () => {
    const page = createNewPage({ title: "  My page  " });

    expect(page.id).toMatch(/^PAGE_/);
    expect(page.title).toBe("My page");
    expect(page.widgetIds).toEqual([]);
    expect(page.effectIds).toEqual([]);
    expect(page.type).toBe("page");
  });
});

describe("createWidgetDefinition", () => {
  it("creates string field definitions", () => {
    const definition = createWidgetDefinition(
      {
        label: "  Email ",
        inputType: "email",
        required: true,
        maxLength: "20",
        minLength: "",
        defaultValue: "  a@b.co ",
        multiline: true,
      },
      "string",
    );

    expect(definition).toEqual({
      kind: "field",
      type: "string",
      label: "Email",
      description: undefined,
      placeholder: undefined,
      required: true,
      inputType: "email",
      multiline: true,
      maxLength: 20,
      minLength: undefined,
      defaultValue: "a@b.co",
    });
  });

  it("creates number, boolean and choice definitions", () => {
    expect(
      createWidgetDefinition(
        {
          label: " Number ",
          min: "1",
          max: "10",
          defaultValue: "5",
        },
        "number",
      ),
    ).toMatchObject({
      kind: "field",
      type: "number",
      label: "Number",
      min: 1,
      max: 10,
      defaultValue: 5,
    });

    expect(
      createWidgetDefinition(
        { label: "Boolean", defaultChecked: true },
        "boolean",
      ),
    ).toMatchObject({
      kind: "field",
      type: "boolean",
      defaultChecked: true,
    });

    expect(
      createWidgetDefinition(
        {
          label: "Choice",
          options: [{ label: "A", value: "a" }],
          multiSelect: true,
          minRequired: "1",
          defaultValues: [],
          defaultValue: ["a"],
        },
        "choice",
      ),
    ).toMatchObject({
      kind: "field",
      type: "choice",
      multiSelect: true,
      minRequired: 1,
      defaultValue: ["a"],
    });
  });

  it("creates UI widget definitions", () => {
    expect(
      createWidgetDefinition(
        { label: "Text", text: "Hello", variant: "title" },
        "text",
      ),
    ).toEqual({
      kind: "ui",
      type: "text",
      label: "Text",
      text: "Hello",
      variant: "title",
    });

    expect(
      createWidgetDefinition(
        { label: "Link", text: "Open", href: "https://example.com" },
        "link",
      ),
    ).toMatchObject({
      kind: "ui",
      type: "link",
      text: "Open",
      href: "https://example.com",
    });

    expect(createWidgetDefinition({ label: "Divider" }, "divider")).toEqual({
      kind: "ui",
      type: "divider",
      label: "Divider",
    });
  });

  it("creates a widget bound to its page", () => {
    const widget = createNewWidget(
      {
        widgetType: "string",
        label: "Field",
        inputType: "text",
      },
      "PAGE_1",
    );

    expect(widget.id).toMatch(/^WIDGET_/);
    expect(widget.pageId).toBe("PAGE_1");
    expect(widget.kind).toBe("field");
  });
});

describe("effect form value conversion", () => {
  it("round-trips a comparison field effect", () => {
    const effect = {
      id: "EFFECT_1",
      owner: "PAGE_1",
      type: "field" as const,
      fn: {
        type: ComparisonType.EQ,
        fieldId: "WIDGET_1",
        value: "yes",
      },
      action: {
        type: FieldActionType.HIDE_WIDGETS,
        widgetIds: ["WIDGET_2"],
      },
    };

    const values = generateEffectFieldValues(effect);

    expect(getEffectsFromFormValues("PAGE_1", values)).toEqual([effect]);
  });

  it("round-trips a logical effect", () => {
    const effect: Effect = {
      id: "EFFECT_LOGICAL",
      owner: "PAGE_1",
      type: "field",
      fn: {
        type: LogicalType.AND,
        operands: [
          {
            type: ComparisonType.EQ,
            fieldId: "WIDGET_1",
            value: "a",
          },
          {
            type: ComparisonType.GT,
            fieldId: "WIDGET_2",
            value: 2,
          },
        ],
      },
      action: {
        type: FieldActionType.HIDE_WIDGETS,
        widgetIds: ["WIDGET_3"],
      },
    };

    const values = generateEffectFieldValues(effect);

    expect(getEffectsFromFormValues("PAGE_1", values)).toEqual([effect]);
  });

  it("round-trips a page effect", () => {
    const effect = {
      id: "EFFECT_PAGE",
      owner: "PAGE_1",
      type: "page" as const,
      fn: {
        type: ComparisonType.NEQ,
        fieldId: "WIDGET_1",
        value: "no",
      },
      action: {
        type: PageActionType.GO_TO_PAGE,
        pageId: "PAGE_2",
      },
    };

    const values = generateEffectFieldValues(effect);

    expect(getEffectsFromFormValues("PAGE_1", values)).toEqual([effect]);
  });

  it("collects unique effect ids", () => {
    const values = {
      "EFFECT_1~effectType": "field",
      "EFFECT_1~actionType": "HIDE_WIDGETS",
      "EFFECT_1~actionPayload": ["WIDGET_2"],
      "EFFECT_1~FIRSTCOMPARISONFN~operator": "EQ",
      "EFFECT_1~FIRSTCOMPARISONFN~fieldId": "WIDGET_1",
      "EFFECT_1~FIRSTCOMPARISONFN~value": "yes",
      "EFFECT_2~effectType": "page",
    };

    expect(getEffectIds(values)).toEqual(["EFFECT_1", "EFFECT_2"]);
  });

  it("builds edit page values", () => {
    const page = createPage("PAGE_1");
    const effect = {
      id: "EFFECT_1",
      owner: "PAGE_1",
      type: "page" as const,
      fn: {
        type: ComparisonType.EQ,
        fieldId: "WIDGET_1",
        value: "yes",
      },
      action: {
        type: PageActionType.GO_TO_PAGE,
        pageId: "PAGE_2",
      },
    };

    const values = {
      title: "  New title ",
      ...generateEffectFieldValues(effect),
    };

    expect(createEditPageProps(values, page)).toEqual({
      title: "New title",
      effects: [effect],
    });
  });
});
