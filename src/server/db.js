import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const filedir =
  typeof exports === "object"
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));

const file = join(filedir.split("/").slice(0, -2).join("/"), "db.local.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

export async function setLog(logId, log) {
  await db.read();
  db.data.logs[logId] = log;
  await db.write();
}

export async function getLogIds() {
  await db.read();
  return Object.keys(db.data.logs);
}

export async function getLog(logId) {
  await db.read();
  if (Object.prototype.hasOwnProperty.call(db.data.logs, logId)) {
    return db.data.logs[logId];
  }
  return null;
}
