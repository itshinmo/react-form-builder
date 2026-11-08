import { describe, expect, it } from "vitest";
import {
  ComparisonType,
  FieldActionType,
  LogicalType,
  PageActionType,
} from "./constants";
import type { ComparisonFn, Fn } from "./types";
import {
  getFieldEffects,
  getPageEffects,
  getVisibleFieldData,
  getVisiblePageData,
  getVisibleWidgetIds,
  isEffectTriggered,
} from "./effects";
import { createDocumentSchema, createPage } from "test/factories";

const buildFn = (overrides: Partial<ComparisonFn> = {}): ComparisonFn => ({
  type: ComparisonType.EQ,
  fieldId: "WIDGET_1",
  value: "yes",
  ...overrides,
});

describe("isEffectTriggered", () => {
  it("evaluates comparison operators", () => {
    const data = {
      WIDGET_1: "yes",
      NUMBER: 10,
      CHOICE: ["a", "b"],
    };

    expect(isEffectTriggered(buildFn(), data)).toBe(true);
    expect(
      isEffectTriggered(
        buildFn({ type: ComparisonType.EQ, value: "no" }),
        data,
      ),
    ).toBe(false);
    expect(
      isEffectTriggered(
        buildFn({ type: ComparisonType.NEQ, value: "no" }),
        data,
      ),
    ).toBe(true);
    expect(
      isEffectTriggered(
        buildFn({ type: ComparisonType.GT, fieldId: "NUMBER", value: 5 }),
        data,
      ),
    ).toBe(true);
    expect(
      isEffectTriggered(
        buildFn({ type: ComparisonType.LTE, fieldId: "NUMBER", value: 10 }),
        data,
      ),
    ).toBe(true);
    expect(
      isEffectTriggered(
        buildFn({
          type: ComparisonType.IN,
          fieldId: "CHOICE",
          value: "a",
        }),
        data,
      ),
    ).toBe(true);
    expect(
      isEffectTriggered(
        buildFn({
          type: ComparisonType.NIN,
          fieldId: "CHOICE",
          value: "c",
        }),
        data,
      ),
    ).toBe(true);
  });

  it("returns false when the compared widget has no value", () => {
    expect(isEffectTriggered(buildFn(), {})).toBe(false);
  });

  it("evaluates logical conditions", () => {
    const data = { WIDGET_1: "yes", WIDGET_2: "no" };

    const fn: Fn = {
      type: LogicalType.AND,
      operands: [
        {
          type: ComparisonType.EQ,
          fieldId: "WIDGET_1",
          value: "yes",
        },
        {
          type: ComparisonType.EQ,
          fieldId: "WIDGET_2",
          value: "yes",
        },
      ],
    };

    expect(isEffectTriggered(fn, data)).toBe(false);

    const orFn: Fn = {
      type: LogicalType.OR,
      operands: fn.operands,
    };

    expect(isEffectTriggered(orFn, data)).toBe(true);
  });
});

describe("getVisibleWidgetIds", () => {
  const createSchema = () => {
    const fieldEffect1 = {
      id: "EFFECT_1",
      owner: "PAGE_1",
      type: "field" as const,
      fn: {
        type: ComparisonType.EQ,
        fieldId: "WIDGET_CONTROL",
        value: "hide-one",
      },
      action: {
        type: FieldActionType.HIDE_WIDGETS,
        widgetIds: ["WIDGET_1"],
      },
    };
    const fieldEffect2 = {
      id: "EFFECT_2",
      owner: "PAGE_1",
      type: "field" as const,
      fn: {
        type: ComparisonType.EQ,
        fieldId: "WIDGET_CONTROL",
        value: "hide-two",
      },
      action: {
        type: FieldActionType.HIDE_WIDGETS,
        widgetIds: ["WIDGET_2"],
      },
    };

    return createDocumentSchema({
      pageIds: ["PAGE_1"],
      pages: {
        PAGE_1: createPage("PAGE_1", {
          widgetIds: ["WIDGET_CONTROL", "WIDGET_1", "WIDGET_2", "WIDGET_3"],
          effectIds: ["EFFECT_1", "EFFECT_2"],
        }),
      },
      effects: {
        EFFECT_1: fieldEffect1,
        EFFECT_2: fieldEffect2,
      },
    });
  };

  it("combines all triggered hide effects instead of overwriting them", () => {
    const schema = createSchema();

    expect(
      getVisibleWidgetIds(schema, "PAGE_1", {
        WIDGET_CONTROL: "hide-one",
      }),
    ).toEqual(["WIDGET_CONTROL", "WIDGET_2", "WIDGET_3"]);

    expect(
      getVisibleWidgetIds(schema, "PAGE_1", {
        WIDGET_CONTROL: "hide-two",
      }),
    ).toEqual(["WIDGET_CONTROL", "WIDGET_1", "WIDGET_3"]);
  });

  it("shows everything when no effect triggers", () => {
    const schema = createSchema();

    expect(getVisibleWidgetIds(schema, "PAGE_1", {})).toEqual([
      "WIDGET_CONTROL",
      "WIDGET_1",
      "WIDGET_2",
      "WIDGET_3",
    ]);
  });
});

describe("effect selectors", () => {
  it("separates page and field effects and ignores missing pages", () => {
    const pageEffect = {
      id: "EFFECT_PAGE",
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
    const fieldEffect = {
      id: "EFFECT_FIELD",
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

    const schema = createDocumentSchema({
      pageIds: ["PAGE_1"],
      pages: {
        PAGE_1: createPage("PAGE_1", {
          effectIds: ["EFFECT_PAGE", "EFFECT_FIELD"],
        }),
      },
      effects: {
        EFFECT_PAGE: pageEffect,
        EFFECT_FIELD: fieldEffect,
      },
    });

    expect(getPageEffects("PAGE_1", schema)).toEqual([pageEffect]);
    expect(getFieldEffects("PAGE_1", schema)).toEqual([fieldEffect]);
    expect(getPageEffects("MISSING", schema)).toEqual([]);
  });
});

describe("getVisibleFieldData", () => {
  it("keeps only currently visible widget values", () => {
    expect(
      getVisibleFieldData({ WIDGET_1: "a", WIDGET_2: "b", WIDGET_3: "c" }, [
        "WIDGET_1",
        "WIDGET_3",
      ]),
    ).toEqual({ WIDGET_1: "a", WIDGET_3: "c" });
  });
});

describe("getVisiblePageData", () => {
  it("removes hidden values from completed pages", () => {
    const effect = {
      id: "EFFECT_HIDE",
      owner: "PAGE_1",
      type: "field" as const,
      fn: {
        type: ComparisonType.EQ,
        fieldId: "WIDGET_CONTROL",
        value: "hide",
      },
      action: {
        type: FieldActionType.HIDE_WIDGETS,
        widgetIds: ["WIDGET_HIDDEN"],
      },
    };

    const schema = createDocumentSchema({
      pageIds: ["PAGE_1", "PAGE_2"],
      pages: {
        PAGE_1: createPage("PAGE_1", {
          widgetIds: ["WIDGET_CONTROL", "WIDGET_HIDDEN"],
          effectIds: ["EFFECT_HIDE"],
        }),
        PAGE_2: createPage("PAGE_2", {
          widgetIds: ["WIDGET_OTHER"],
        }),
      },
      effects: { EFFECT_HIDE: effect },
    });

    expect(
      getVisiblePageData(schema, ["PAGE_1", "PAGE_2"], {
        PAGE_1: { WIDGET_CONTROL: "hide", WIDGET_HIDDEN: "secret" },
        PAGE_2: { WIDGET_OTHER: "visible" },
      }),
    ).toEqual({ WIDGET_CONTROL: "hide", WIDGET_OTHER: "visible" });
  });
});
