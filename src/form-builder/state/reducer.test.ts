import { describe, expect, it } from "vitest";
import { ComparisonType, FieldActionType } from "form-engine";
import {
  createAddPageAction,
  createAddWidgetAction,
  createEditPageAction,
  createEditWidgetAction,
  createRemovePageAction,
  createRemoveWidgetAction,
} from "./actions";
import reducer from "./reducer";
import {
  createBuilderState,
  createFieldEffect,
  createPage,
  createStringWidget,
  createPageEffect,
} from "test/factories";

const createState = () => {
  const pageOne = createPage("PAGE_1", {
    widgetIds: ["WIDGET_1", "WIDGET_2"],
    effectIds: ["EFFECT_OWNED"],
  });
  const pageTwo = createPage("PAGE_2", {
    widgetIds: ["WIDGET_3"],
    effectIds: ["EFFECT_REFERENCES_ONE", "EFFECT_REFERENCES_TARGET"],
  });

  return createBuilderState({
    pages: [pageOne, pageTwo],
    widgets: [
      createStringWidget("WIDGET_1", "PAGE_1"),
      createStringWidget("WIDGET_2", "PAGE_1"),
      createStringWidget("WIDGET_3", "PAGE_2"),
    ],
    effects: [
      createFieldEffect("EFFECT_OWNED", "PAGE_1", {
        fieldId: "WIDGET_1",
        widgetIds: ["WIDGET_2"],
      }),
      createFieldEffect("EFFECT_REFERENCES_ONE", "PAGE_2", {
        fieldId: "WIDGET_1",
        widgetIds: ["WIDGET_3"],
      }),
      createFieldEffect("EFFECT_REFERENCES_TARGET", "PAGE_2", {
        fieldId: "WIDGET_3",
        widgetIds: ["WIDGET_1"],
      }),
    ],
  });
};

describe("form builder reducer", () => {
  it("adds pages and widgets", () => {
    const page = createPage("PAGE_NEW");
    const withPage = reducer(
      createBuilderState({ pages: [] }),
      createAddPageAction(page),
    );

    expect(withPage.pages.allIds).toEqual(["PAGE_NEW"]);

    const widget = createStringWidget("WIDGET_NEW", "PAGE_NEW");
    const withWidget = reducer(withPage, createAddWidgetAction(widget));

    expect(withWidget.widgets.allIds).toEqual(["WIDGET_NEW"]);
    expect(withWidget.pages.byId.PAGE_NEW?.widgetIds).toEqual(["WIDGET_NEW"]);
  });

  it("does not add unknown or duplicate entities", () => {
    const state = createBuilderState({
      pages: [createPage("PAGE_1")],
    });

    expect(reducer(state, createAddPageAction(createPage("PAGE_1")))).toBe(
      state,
    );
    expect(
      reducer(
        state,
        createAddWidgetAction(createStringWidget("WIDGET_1", "MISSING")),
      ),
    ).toBe(state);
  });

  it("removes widgets and all effects that reference them", () => {
    const state = reducer(createState(), createRemoveWidgetAction("WIDGET_1"));

    expect(state.widgets.byId.WIDGET_1).toBeUndefined();
    expect(state.widgets.allIds).not.toContain("WIDGET_1");
    expect(state.pages.byId.PAGE_1?.widgetIds).toEqual(["WIDGET_2"]);

    // The effect owned by page 1 used WIDGET_1 in its condition.
    expect(state.effects.byId.EFFECT_OWNED).toBeUndefined();
    // The effect owned by page 2 used WIDGET_1 in its condition.
    expect(state.effects.byId.EFFECT_REFERENCES_ONE).toBeUndefined();
    // This effect used WIDGET_1 as an action target and became empty.
    expect(state.effects.byId.EFFECT_REFERENCES_TARGET).toBeUndefined();

    expect(state.pages.byId.PAGE_1?.effectIds).toEqual([]);
    expect(state.pages.byId.PAGE_2?.effectIds).toEqual([]);
  });

  it("removes a page, its widgets and every effect targeting it", () => {
    const state = reducer(createState(), createRemovePageAction("PAGE_1"));

    expect(state.pages.byId.PAGE_1).toBeUndefined();
    expect(state.widgets.byId.WIDGET_1).toBeUndefined();
    expect(state.widgets.byId.WIDGET_2).toBeUndefined();
    expect(state.widgets.byId.WIDGET_3).toBeDefined();

    expect(state.effects.byId.EFFECT_OWNED).toBeUndefined();
    expect(state.effects.byId.EFFECT_REFERENCES_ONE).toBeUndefined();
    expect(state.effects.byId.EFFECT_REFERENCES_TARGET).toBeUndefined();
    expect(state.pages.byId.PAGE_2?.effectIds).toEqual([]);
  });

  it("removes page effects whose target page was deleted", () => {
    const state = createBuilderState({
      pages: [
        createPage("PAGE_1"),
        createPage("PAGE_2", {
          effectIds: ["EFFECT_GO_TO_ONE"],
        }),
      ],
      effects: [
        createPageEffect("EFFECT_GO_TO_ONE", "PAGE_2", {
          fieldId: "WIDGET_1",
          targetPageId: "PAGE_1",
        }),
      ],
    });

    const updated = reducer(state, createRemovePageAction("PAGE_1"));

    expect(updated.effects.byId.EFFECT_GO_TO_ONE).toBeUndefined();
    expect(updated.pages.byId.PAGE_2?.effectIds).toEqual([]);
  });

  it("edits widgets while preserving their identity", () => {
    const state = createState();
    const updated = reducer(
      state,
      createEditWidgetAction("WIDGET_1", {
        kind: "field",
        type: "string",
        label: "Updated",
        inputType: "email",
      }),
    );

    expect(updated.widgets.byId.WIDGET_1).toMatchObject({
      id: "WIDGET_1",
      pageId: "PAGE_1",
      label: "Updated",
      inputType: "email",
    });
  });

  it("replaces page effects and assigns the page as owner", () => {
    const state = createState();
    const newEffect = createFieldEffect("EFFECT_NEW", "WRONG_OWNER", {
      fieldId: "WIDGET_2",
      widgetIds: ["WIDGET_1"],
    });

    const updated = reducer(
      state,
      createEditPageAction("PAGE_1", "  New title  ", [newEffect]),
    );

    expect(updated.pages.byId.PAGE_1?.title).toBe("New title");
    expect(updated.pages.byId.PAGE_1?.effectIds).toEqual(["EFFECT_NEW"]);
    expect(updated.effects.byId.EFFECT_NEW?.owner).toBe("PAGE_1");
    expect(updated.effects.byId.EFFECT_OWNED).toBeUndefined();
    expect(updated.effects.allIds).not.toContain("EFFECT_OWNED");
  });

  it("clears page effects when none are provided", () => {
    const updated = reducer(
      createState(),
      createEditPageAction("PAGE_1", "Title"),
    );

    expect(updated.pages.byId.PAGE_1?.effectIds).toEqual([]);
    expect(updated.effects.byId.EFFECT_OWNED).toBeUndefined();
  });

  it("keeps effect conditions valid when deleting a target widget", () => {
    const state = reducer(createState(), createRemoveWidgetAction("WIDGET_1"));

    const remainingEffect = state.effects.byId.EFFECT_OWNED;

    expect(remainingEffect).toBeUndefined();
    expect(
      Object.values(state.effects.byId).some(
        effect =>
          effect.fn.type === ComparisonType.EQ &&
          effect.fn.fieldId === "WIDGET_1",
      ),
    ).toBe(false);
  });

  it("removes effects that hide deleted widgets even when owned elsewhere", () => {
    const states = createBuilderState({
      pages: [createPage("PAGE_1"), createPage("PAGE_2")],
      widgets: [
        createStringWidget("WIDGET_1", "PAGE_1"),
        createStringWidget("WIDGET_2", "PAGE_2"),
      ],
      effects: [
        {
          id: "EFFECT_HIDE_DELETED",
          owner: "PAGE_2",
          type: "field",
          fn: {
            type: ComparisonType.EQ,
            fieldId: "WIDGET_2",
            value: "x",
          },
          action: {
            type: FieldActionType.HIDE_WIDGETS,
            widgetIds: ["WIDGET_1"],
          },
        },
      ],
    });

    const updated = reducer(states, createRemoveWidgetAction("WIDGET_1"));

    expect(updated.effects.byId.EFFECT_HIDE_DELETED).toBeUndefined();
  });
});
