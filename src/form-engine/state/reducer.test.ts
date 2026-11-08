import { describe, expect, it } from "vitest";
import {
  createNavigateAction,
  createResetAction,
  createSetPageDataAction,
  createSetVisibleWidgetsAction,
  createSyncPageAction,
} from "./actions";
import reducer, { INITIAL_STATE, type State } from "./reducer";

const initialState: State = {
  ...INITIAL_STATE,
  currentPage: "PAGE_1",
  currentPageWidgets: ["WIDGET_1"],
  visibleWidgets: ["WIDGET_1"],
};

describe("schema state reducer", () => {
  it("tracks visited pages when navigating forward and back", () => {
    const pageTwo = reducer(
      initialState,
      createNavigateAction("PAGE_2", ["WIDGET_2"], ["WIDGET_2"]),
    );

    expect(pageTwo.currentPage).toBe("PAGE_2");
    expect(pageTwo.visitedPages).toEqual(["PAGE_1"]);

    const back = reducer(
      pageTwo,
      createNavigateAction("PAGE_1", ["WIDGET_1"], ["WIDGET_1"], true),
    );

    expect(back.currentPage).toBe("PAGE_1");
    expect(back.visitedPages).toEqual([]);
  });

  it("does not add an empty initial page to the history", () => {
    const state = reducer(
      INITIAL_STATE,
      createNavigateAction("PAGE_1", [], []),
    );

    expect(state.visitedPages).toEqual([]);
  });

  it("merges page data", () => {
    const state = reducer(
      initialState,
      createSetPageDataAction("PAGE_1", { WIDGET_1: "hello" }),
    );
    const updated = reducer(
      state,
      createSetPageDataAction("PAGE_1", { WIDGET_2: "world" }),
    );

    expect(updated.pageData.PAGE_1).toEqual({
      WIDGET_1: "hello",
      WIDGET_2: "world",
    });
  });

  it("ignores an identical visible widget update", () => {
    const state = reducer(
      initialState,
      createSetVisibleWidgetsAction(["WIDGET_1"]),
    );

    expect(state).toBe(initialState);
  });

  it("syncs the current page without clearing entered data", () => {
    const withData = reducer(
      initialState,
      createSetPageDataAction("PAGE_1", { WIDGET_1: "value" }),
    );

    const synced = reducer(
      withData,
      createSyncPageAction(
        "PAGE_2",
        ["WIDGET_2"],
        ["WIDGET_2"],
        ["PAGE_1", "PAGE_2"],
      ),
    );

    expect(synced.currentPage).toBe("PAGE_2");
    expect(synced.pageData).toEqual({ PAGE_1: { WIDGET_1: "value" } });
  });

  it("drops visited pages that no longer exist in the schema", () => {
    const withHistory = reducer(
      initialState,
      createNavigateAction("PAGE_2", ["WIDGET_2"], ["WIDGET_2"]),
    );

    const synced = reducer(
      withHistory,
      createSyncPageAction("PAGE_2", ["WIDGET_2"], ["WIDGET_2"], ["PAGE_2"]),
    );

    expect(synced.visitedPages).toEqual([]);
  });

  it("returns the same state when sync values are identical", () => {
    const state = reducer(
      initialState,
      createSyncPageAction("PAGE_1", ["WIDGET_1"], ["WIDGET_1"], ["PAGE_1"]),
    );

    expect(state).toBe(initialState);
  });

  it("resets the form state", () => {
    const withData = reducer(
      initialState,
      createSetPageDataAction("PAGE_1", { WIDGET_1: "value" }),
    );

    const reset = reducer(
      withData,
      createResetAction("PAGE_1", ["WIDGET_1"], ["WIDGET_1"]),
    );

    expect(reset).toEqual({
      ...initialState,
      pageData: {},
    });
  });
});
