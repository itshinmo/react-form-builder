import * as React from "react";
import type { DocumentSchema } from "./schema/types";

const SchemaContext = React.createContext<DocumentSchema | null>(null);

if (import.meta.env.DEV) {
  SchemaContext.displayName = "SchemaContext";
}

type ProviderProps = {
  children: React.ReactNode;
  schema: DocumentSchema;
};

export const SchemaProvider = (props: ProviderProps) => {
  const { children, schema } = props;

  return (
    <SchemaContext.Provider value={schema}>{children}</SchemaContext.Provider>
  );
};

export const useSchema = () => React.useContext(SchemaContext);
