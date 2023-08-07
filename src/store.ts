import { writable, type Writable } from "svelte/store";
import type { InventoryItem, Material } from "./model";

export const isBackdrop = writable(false);
export const isEditMaterial = writable(false);
export const isEditInventory = writable(false);

export const materialToRemove: Writable<Material> = writable();

export const closeDialogs = () => {
    isBackdrop.set(false);
    isEditMaterial.set(false);
    isEditInventory.set(false);
    materialToRemove.set(null);
};

export const showEditMaterial = () => {
    isEditMaterial.set(true);
    isBackdrop.set(true);
};

export const showRemoveMaterial = (mat: Material) => {
    materialToRemove.set(mat);
    isBackdrop.set(true);
};

export const showEditInventoryItem = () => {
    isEditInventory.set(true);
    isBackdrop.set(true);
};

export const nuMaterial = (): Material => ({
    name: "",
    unit: "m",
    price: 0,
    decimal: 0,
    removed: false,
});

export const nuItem = (): InventoryItem => ({
    name: "",
    price: 0,
    qty: 0,
    thumb: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
    recipe: [],
});

export const editingMaterial: Writable<Material> = writable();
export const editingInventoryItem: Writable<InventoryItem> = writable();
