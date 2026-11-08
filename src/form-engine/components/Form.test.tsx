import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  createDocumentSchema,
  createPage,
  createStringWidget,
} from "test/factories";
import Form from "./Form";

describe("Form", () => {
  it("renders the first page and its visible widgets", () => {
    const schema = createDocumentSchema({
      pageIds: ["PAGE_1"],
      pages: {
        PAGE_1: createPage("PAGE_1", {
          title: "Welcome",
          widgetIds: ["WIDGET_1"],
        }),
      },
      widgets: {
        WIDGET_1: createStringWidget("WIDGET_1", "PAGE_1", {
          label: "Your name",
        }),
      },
    });

    const html = renderToStaticMarkup(<Form schema={schema} />);

    expect(html).toContain("Welcome");
    expect(html).toContain("Your name");
    expect(html).toContain("Submit");
  });
});
