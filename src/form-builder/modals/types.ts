import type { FormItem, PageNode } from "../types";

export type AddTarget = { type: "page" } | { type: "widget"; parent: PageNode };

export type ModalController = {
  open: (item: FormItem) => void;
  close: () => void;
  render: () => JSX.Element | null;
};

export type AddModalController = {
  open: (target: AddTarget) => void;
  close: () => void;
  render: () => JSX.Element | null;
};
