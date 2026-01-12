import z from "zod";
import { WAREHOUSE_LIMITS } from "../utils/warehouse";
import { parseSchemaData } from "../utils/schema";

export const WarehouseSchema = z.object({
  name: z
    .string()
    .min(WAREHOUSE_LIMITS.NAME_MIN, "Name is required")
    .max(WAREHOUSE_LIMITS.NAME_MAX, "Name is too long"),
  location: z
    .string()
    .max(WAREHOUSE_LIMITS.LOCATION_MAX, "Location is too long"),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;

export function parseWarehouseData(
  data: FormData | Record<string, unknown>
): Warehouse {
  return parseSchemaData(WarehouseSchema, data);
}
