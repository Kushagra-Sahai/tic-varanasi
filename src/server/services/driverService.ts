import "server-only";
import { readCollection } from "@/lib/jsondb";
import type { Driver } from "@/lib/entities";

export async function listAvailableDrivers() {
  const drivers = await readCollection<Driver>("drivers");
  return drivers.filter((d) => d.isAvailable);
}
