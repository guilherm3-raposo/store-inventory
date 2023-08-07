import Dexie, { liveQuery, type PromiseExtended } from "dexie";
import { writable } from "svelte/store";
import { toMap } from "./util";
import type { Config, Material } from "./model";

export const db = new Dexie("lauren-store");

db.version(1).stores({
    materials: "++id, name, unit, price",
    inventory: "++id, name, cost, price, qty",
});

db.version(2).stores({
    materials: "++id, name, unit, price, removed",
    inventory: "++id, name, cost, price, qty, removed",
});

db.version(3).stores({
    config: "++id, darkMode",
    materials: "++id, name, unit, price, removed",
    inventory: "++id, name, cost, price, qty, removed",
});

export const getConfig = liveQuery(() => {
    return <PromiseExtended<Config>>db.table("config").get(1);
});

export const saveConfig = (config: Config) => db.table("config").put(config);

export const putMaterial = (mat: Material) => db.table("materials").put(mat);

export const removeMaterial = (id: number) => {
    return db.table("materials").update(id, { removed: true });
};

export const materials = liveQuery(() =>
    db
        .table("materials")
        .filter((m) => !m.removed)
        .toArray()
);

materials.subscribe({
    next: (materials) => materialsMap.set(toMap(materials)),
});

/**
 * @type {import("svelte/store").Writable<{[key:number]: any}>}
 */
export const materialsMap = writable({});

/**
 * @param {any} inventoryItem
 */
export const putInventoryItem = (inventoryItem) =>
    db.table("inventory").put(inventoryItem);

/**
 * @param {number} id
 */
export const removeInventoryItem = (id) =>
    db.table("inventory").update(id, { removed: true });

/**
//  * @type {any}
 */
export const inventory = liveQuery(() =>
    db
        .table("inventory")
        .filter((r) => !r.removed)
        .toArray()
);
