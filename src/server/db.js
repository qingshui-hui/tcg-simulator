import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const filedir = typeof exports === 'object'
  ? __dirname : dirname(fileURLToPath(import.meta.url))

const file = join(filedir.split("/").slice(0, -2).join("/"), "db.local.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

export async function setLog(logId, log) {
  await db.read();
  db.logs[logId] = log;
  await db.write();
}
