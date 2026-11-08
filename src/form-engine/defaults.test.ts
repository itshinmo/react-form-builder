import { describe, expect, it } from "vitest";
import { getSchemaDefaultValues } from "./defaults";
import { createDocumentSchema, createPage } from "test/factories";

describe("getSchemaDefaultValues", () => {
  it("collects defaults for every field and ignores UI widgets", () => {
    const schema = createDocumentSchema({
      pageIds: ["PAGE_1"],
      pages: {
        PAGE_1: createPage("PAGE_1", {
          widgetIds: ["STRING", "NUMBER", "BOOLEAN", "CHOICE", "TEXT"],
        }),
      },
      widgets: {
        STRING: {
          id: "STRING",
          pageId: "PAGE_1",
          kind: "field",
          type: "string",
          inputType: "text",
          label: "String",
          defaultValue: "hello",
        },
        NUMBER: {
          id: "NUMBER",
          pageId: "PAGE_1",
          kind: "field",
          type: "number",
          label: "Number",
          defaultValue: 5,
        },
        BOOLEAN: {
          id: "BOOLEAN",
          pageId: "PAGE_1",
          kind: "field",
          type: "boolean",
          label: "Boolean",
          defaultChecked: true,
        },
        CHOICE: {
          id: "CHOICE",
          pageId: "PAGE_1",
          kind: "field",
          type: "choice",
          label: "Choice",
          multiSelect: true,
          options: [{ label: "A", value: "a" }],
          defaultValue: ["a"],
        },
        TEXT: {
          id: "TEXT",
          pageId: "PAGE_1",
          kind: "ui",
          type: "text",
          label: "Text",
          text: "hello",
          variant: "paragraph",
        },
      },
    });

    expect(getSchemaDefaultValues(schema)).toEqual({
      STRING: "hello",
      NUMBER: 5,
      BOOLEAN: true,
      CHOICE: ["a"],
    });
  });

  it("uses empty defaults when a field has no explicit default", () => {
    const schema = createDocumentSchema({
      pageIds: ["PAGE_1"],
      pages: {
        PAGE_1: createPage("PAGE_1", { widgetIds: ["STRING", "CHOICE"] }),
      },
      widgets: {
        STRING: {
          id: "STRING",
          pageId: "PAGE_1",
          kind: "field",
          type: "string",
          inputType: "text",
          label: "String",
        },
        CHOICE: {
          id: "CHOICE",
          pageId: "PAGE_1",
          kind: "field",
          type: "choice",
          label: "Choice",
          multiSelect: false,
          options: [],
        },
      },
    });

    expect(getSchemaDefaultValues(schema)).toEqual({
      STRING: "",
      CHOICE: "",
    });
  });
});
