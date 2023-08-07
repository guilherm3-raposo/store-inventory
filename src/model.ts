export interface Config {
    id: number;
    darkMode: boolean;
}

export interface Material {
    id?: number;
    name?: string;
    price?: number;
    unit?: string;
    decimal?: number;
    removed?: boolean;
}

export interface RecipeIngredient {
    id: number;
    qty: number;
}

export interface InventoryItem {
    id?: number;
    name?: string;
    price?: number;
    qty?: number;
    thumb?: string;
    recipe?: RecipeIngredient[];
}
