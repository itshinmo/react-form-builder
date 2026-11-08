import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { FieldValues } from "react-hook-form";
import { useSchema } from "../schema-provider";

type Props = {
  data: FieldValues;
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return "—";

  if (Array.isArray(value)) return value.join(", ");

  if (typeof value === "object") return JSON.stringify(value);

  return String(value);
};

const FormTable = (props: Props) => {
  const { data } = props;

  const schema = useSchema();

  if (!schema) return null;

  const rows = Object.entries(data).flatMap(([widgetId, value]) => {
    const widget = schema.definitions.widgets[widgetId];

    if (!widget || widget.kind !== "field") return [];

    return [
      <TableRow
        key={widgetId}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {widget.label}
        </TableCell>

        <TableCell align="right">{formatValue(value)}</TableCell>
      </TableRow>,
    ];
  });

  return (
    <TableContainer sx={{ marginBottom: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default FormTable;
