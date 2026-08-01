import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

export const newId = () => randomUUID();

// Per-collection write queues — serializes read-modify-write cycles within
// this process so concurrent requests can't race each other. Doesn't protect
// across multiple processes/instances, but this is a single-instance,
// non-persistent-across-deploys store by design (see plan notes), so that's
// an accepted limit, not a bug.
const queues = new Map<string, Promise<unknown>>();

function withLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const prev = queues.get(name) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  queues.set(
    name,
    next.catch(() => undefined),
  );
  return next;
}

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

export async function readCollection<T>(name: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath(name), "utf-8");
    return JSON.parse(raw) as T[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeCollectionRaw<T>(name: string, data: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = filePath(name);
  const tmp = `${target}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, target);
}

/** Serialized read-modify-write against one collection — the JSON-store stand-in for a DB transaction. */
export function mutateCollection<T>(
  name: string,
  fn: (rows: T[]) => T[] | Promise<T[]>,
): Promise<T[]> {
  return withLock(name, async () => {
    const rows = await readCollection<T>(name);
    const next = await fn(rows);
    await writeCollectionRaw(name, next);
    return next;
  });
}

export async function readRecord<T>(name: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath(name), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export function mutateRecord<T>(name: string, fn: (record: T | null) => T | Promise<T>): Promise<T> {
  return withLock(name, async () => {
    const current = await readRecord<T>(name);
    const next = await fn(current);
    await fs.mkdir(DATA_DIR, { recursive: true });
    const target = filePath(name);
    const tmp = `${target}.${randomUUID()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf-8");
    await fs.rename(tmp, target);
    return next;
  });
}
