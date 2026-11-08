import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FormBuilder from "./FormBuilder";

describe("FormBuilder", () => {
  it("renders the empty builder shell", () => {
    const html = renderToStaticMarkup(<FormBuilder />);

    expect(html).toContain("React Form Builder");
    expect(html).toContain("Create new Page");
    expect(html).toContain("No pages yet");
  });
});
