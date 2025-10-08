import { openDB } from "idb";

const DB_NAME = "coins-db";
const STORE = "coins";
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "key" });
        store.createIndex("key", "key");
      }
    },
  });
}

export async function savePage(key: string, payload: any) {
  const db = await getDB();
  await db.put(STORE, { key, payload, cachedAt: Date.now() });
}

export async function getPage(key: string) {
  const db = await getDB();
  const entry = await db.get(STORE, key);
  return entry?.payload;
}

export async function clearCache() {
  const db = await getDB();
  await db.clear(STORE);
}
