import type { FormItem } from "../types";
import { isPageNode } from "../utils";
import {
  BooleanFieldSettings,
  ChoiceFieldSettings,
  DividerWidgetSettings,
  LinkWidgetSettings,
  NumberFieldSettings,
  PageSettings,
  StringFieldSettings,
  TextWidgetSettings,
} from "./settings";

type Props = {
  item: FormItem;
};

const SettingsEditor = (props: Props) => {
  const { item } = props;

  if (isPageNode(item)) return <PageSettings />;

  if (item.kind === "field") {
    switch (item.type) {
      case "string":
        return <StringFieldSettings />;

      case "number":
        return <NumberFieldSettings />;

      case "boolean":
        return <BooleanFieldSettings />;

      case "choice":
        return <ChoiceFieldSettings />;

      default:
        return null;
    }
  }

  switch (item.type) {
    case "text":
      return <TextWidgetSettings />;

    case "link":
      return <LinkWidgetSettings />;

    case "divider":
      return <DividerWidgetSettings />;

    default:
      return null;
  }
};

export default SettingsEditor;
