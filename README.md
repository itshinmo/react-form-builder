# React Form Builder

An interactive, schema-driven form builder built with React, TypeScript and MUI. The app lets you create a multi-page form visually in a tree editor, configure widgets and validation, connect conditions/effects, and try the result immediately in a live preview.

> **Status:** alpha. The builder is a single-page app and the form engine is reusable inside this repository, but it is not published as an npm package yet.

## What is in this project?

The repository contains two related parts:

1. **Form builder (`src/form-builder`)** — the editor UI:
   - pages and widget hierarchy
   - add/edit/delete dialogs
   - field and UI widget settings
   - condition/effect editor
   - live form preview
2. **Form engine (`src/form-engine`)** — the runtime that renders a schema:
   - page navigation and visited-page tracking
   - field widgets (text, number, boolean, choice)
   - UI widgets (text, link, divider)
   - field effects (hide widgets) and page effects (go to page)
   - validation and the submitted-result table

The builder stores its state as normalized maps of pages, widgets and effects. The preview converts that state into a `DocumentSchema` and passes it to the engine's `Form` component.

## Features

- Multi-page forms with back navigation.
- Seven widget types:
  - **Field:** string, number, boolean, choice
  - **UI:** text, link, divider
- String fields support text/email input, multiline, length limits and defaults.
- Number fields support min/max validation and defaults.
- Choice fields support radio groups, checkboxes or a select, option shuffling, multi-select and min/max selection counts.
- Choice lists automatically switch to a select when there are 5 or more options.
- Conditions can combine comparisons with `AND` / `OR`.
- Field effects can hide one or more widgets dynamically.
- Page effects can navigate to another page.
- Live preview keeps entered values while you edit the schema when possible.
- Submitted values are shown in a result table with a reset action.
- TypeScript strict mode, ESLint/Prettier, production build and Vitest tests.

## Tech stack

- React 18 + TypeScript
- Vite 4
- MUI 5 (`@mui/material`, `@mui/icons-material`, `@mui/x-tree-view`)
- react-hook-form for builder and runtime forms
- Immer for the builder reducer
- Nanoid for entity ids
- Vitest for unit tests

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm or Yarn

### Install and run

```bash
git clone https://github.com/Mohsen-Shamsitabar/react-form-builder.git
cd react-form-builder
yarn install
yarn dev
```

The development server prints its URL (normally <http://localhost:5173/react-form-builder>).

Using npm instead:

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `yarn dev`        | Start the Vite development server.                   |
| `yarn build`      | Type-check and create a production build in `dist/`. |
| `yarn preview`    | Preview the production build locally.                |
| `yarn typecheck`  | Run `tsc --noEmit`.                                  |
| `yarn lint`       | Run ESLint with zero warnings allowed.               |
| `yarn test`       | Run the Vitest suite once.                           |
| `yarn test:watch` | Run Vitest in watch mode.                            |
| `yarn deploy`     | Manual legacy deploy to the `gh-pages` branch.       |

The production base path is `/react-form-builder` because the app is deployed as a GitHub Pages project page. If you host it at a different path, update `base` in `vite.config.ts` and `homepage` in `package.json`.

## Deployment

Deployment is automated by `.github/workflows/deploy.yml`:

- Every push to `main` installs dependencies, lints, tests and builds the app, then publishes `dist/` to GitHub Pages.
- The workflow can also be started manually from the **Actions** tab (`workflow_dispatch`).
- Pull requests/uploads are not published; only `main` (or a manual run) deploys.

One-time repository setup:

1. Open **Settings → Pages** for the repository.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

The older `yarn deploy` command still builds and pushes `dist/` to the `gh-pages` branch. It is only useful if Pages is configured to serve from that branch; with the recommended **GitHub Actions** source, use the workflow instead.

## How to use the builder

1. Click **Create new Page** and give the page a title.
2. Use the **+** action on a page to add a widget.
3. Choose a widget kind (`field` or `ui`), then a widget type, and fill in its settings.
4. Add more pages/widgets. Pages and their widgets appear in the hierarchy on the left; the right side is the live preview.
5. Open a page with the settings action and switch to the **effects** tab to create conditions.
6. Use **Cancel** / **Save** in dialogs. Deleting a page or widget also removes effects that reference it.

### Conditions and actions

An effect belongs to the page that owns it (`owner`) and has a condition (`fn`) plus an action.

Comparison condition:

```ts
{
  type: "EQ",          // EQ | NEQ | GT | GTE | LT | LTE | IN | NIN
  fieldId: "WIDGET_1", // widget whose value is compared
  value: "yes"
}
```

Logical condition:

```ts
{
  type: "AND", // AND | OR
  operands: [comparison1, comparison2]
}
```

Always condition:

```ts
{
  type: "ALWAYS";
}
```

`ALWAYS` is useful for page effects on pages with no field widgets. In the builder it is available as **Condition type → Always** for page effects. Field effects still require a field comparison.

Field effect action:

```ts
{
  type: "HIDE_WIDGETS",
  widgetIds: ["WIDGET_2", "WIDGET_3"]
}
```

Page effect action:

```ts
{
  type: "GO_TO_PAGE",
  pageId: "PAGE_2"
}
```

Effect values are evaluated against the current form values. Hide effects are combined, so multiple triggered effects cannot accidentally make a hidden widget visible again. `ALWAYS` page effects make it possible to navigate from a page that has no fields at all.

### Submission behavior

The form advances or submits according to page effects:

- If a triggered **page effect** points to an existing page, the form navigates there.
- Otherwise the current page is treated as complete and the form is submitted.
- The action button reads **Next** when a triggered page effect will navigate, and **Submit** (or the schema's `submitButtonText`) on pages with no next page.
- On submit, values from the current page and all previously visited pages are merged and shown in the result table.
- Values of hidden widgets are excluded from the submitted result.

This means a form page needs a page effect if it should lead to another page; a page without one acts as a submit point.

## Schema reference

The engine consumes a `DocumentSchema`:

```ts
type DocumentSchema = {
  pageIds: string[];
  submitButtonText: string;
  definitions: {
    pages: Record<string, PageSchema>;
    widgets: Record<string, Widget>;
    effects: Record<string, Effect>;
  };
};
```

Minimal example with one page and one string field:

```json
{
  "pageIds": ["PAGE_welcome"],
  "submitButtonText": "Submit",
  "definitions": {
    "pages": {
      "PAGE_welcome": {
        "id": "PAGE_welcome",
        "title": "Welcome",
        "widgetIds": ["WIDGET_name"],
        "effectIds": []
      }
    },
    "widgets": {
      "WIDGET_name": {
        "id": "WIDGET_name",
        "pageId": "PAGE_welcome",
        "kind": "field",
        "type": "string",
        "label": "Your name",
        "inputType": "text",
        "required": true
      }
    },
    "effects": {}
  }
}
```

### Widget shapes

All widgets have `id`, `pageId`, `kind` and `type`.

| Kind    | Type      | Main properties                                                                                                         |
| ------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `field` | `string`  | `label`, `inputType` (`text`/`email`), `placeholder`, `multiline`, `minLength`, `maxLength`, `defaultValue`, `required` |
| `field` | `number`  | `label`, `placeholder`, `min`, `max`, `defaultValue`, `required`                                                        |
| `field` | `boolean` | `label`, `defaultChecked`, `required`                                                                                   |
| `field` | `choice`  | `label`, `options`, `multiSelect`, `shuffleOptions`, `minRequired`, `maxRequired`, `defaultValue`, `required`           |
| `ui`    | `text`    | `label` (builder only), `text`, `variant` (`paragraph`/`title`/`subtitle`)                                              |
| `ui`    | `link`    | `label` (builder only), `text`, `href`                                                                                  |
| `ui`    | `divider` | `label` (builder only)                                                                                                  |

Example field effect:

```json
{
  "id": "EFFECT_hide_pet_name",
  "owner": "PAGE_pets",
  "type": "field",
  "fn": {
    "type": "EQ",
    "fieldId": "WIDGET_has_pet",
    "value": false
  },
  "action": {
    "type": "HIDE_WIDGETS",
    "widgetIds": ["WIDGET_pet_name"]
  }
}
```

Example page effect:

```json
{
  "id": "EFFECT_go_next",
  "owner": "PAGE_one",
  "type": "page",
  "fn": {
    "type": "EQ",
    "fieldId": "WIDGET_continue",
    "value": true
  },
  "action": {
    "type": "GO_TO_PAGE",
    "pageId": "PAGE_two"
  }
}
```

## Using the form engine in code

Inside this repository, the engine can be imported directly:

```tsx
import { Form } from "form-engine/components";
import type { DocumentSchema } from "form-engine";

const schema: DocumentSchema = {
  // ...
};

export const Example = () => <Form schema={schema} />;
```

`Form` renders pages, fields and UI widgets, applies effects, handles back navigation and shows the submitted result. It expects to own its `react-hook-form` context; do not wrap it in another `FormProvider` with conflicting field names.

Key engine exports:

- `form-engine/components` — `Form`, `SchemaForm`, `SchemaRenderer`, `FormTable`, `BackButton`, `SubmitButton`
- `form-engine/schema/types` — `DocumentSchema`, widget/effect types
- `form-engine/schema/constants` — comparison/action enums and widget option lists
- `form-engine/schema/effects` — condition evaluation and visibility helpers
- `form-engine/state` — `SchemaStateManager` and runtime context
- `form-engine/defaults` — `getSchemaDefaultValues`
- `form-engine/validation` — validation messages, email/number patterns

## Project structure

```text
src/
├── form-builder/              # The visual builder
│   ├── components/
│   │   ├── effects/           # Condition/effect editor
│   │   ├── form-controls/     # Reusable builder form fields
│   │   └── settings/          # Per-widget/page settings
│   ├── modals/                # Add/edit/delete modal controllers
│   ├── state/                 # Builder reducer, actions and context
│   ├── transformers.ts        # Form values → schema entities
│   └── types.ts
├── form-engine/               # Schema-driven form runtime
│   ├── components/            # Form shell, renderer and widgets
│   ├── schema/                # Types, constants, effect evaluation
│   └── state/                 # Runtime page/value/visibility state
├── shared/                    # Shared UI and utilities
├── test/                      # Test factories
├── App.tsx
└── main.tsx
```

## Validation

- Required flags are enforced by react-hook-form.
- String fields validate email format and min/max length.
- Number fields validate numeric input and min/max values.
- Choice fields validate required selections and, when configured, min/max selection counts.

## Tests

The test suite covers the pure logic that is easiest to regress:

- condition evaluation and logical operators
- combined hide-effect visibility
- runtime reducer navigation/history/reset
- builder reducer add/edit/remove cleanup
- schema defaults
- widget/effect transformers and effect form-value round trips

Run:

```bash
yarn test
```

## Known limitations

- Builder data is not persisted or exported/imported as JSON yet; reloading the page starts a fresh form.
- There is no drag-and-drop ordering for pages or widgets.
- Conditions are limited to the two comparison operands of one logical expression.
- A page must have a triggered page effect to navigate; otherwise submitting ends the form.
- UI component tests are not included yet (the current tests target core logic).
- The form engine is intended for internal reuse; it is not published as a package.

## Contributing

1. Create a branch from `main`.
2. Keep changes consistent with the existing feature folders and strict TypeScript settings.
3. Run `yarn lint`, `yarn typecheck`, `yarn test` and `yarn build` before opening a pull request.
