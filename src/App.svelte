<script lang="ts">
    import ConfirmRemoveMaterial from "./components/ConfirmRemoveMaterial.svelte";
    import DarkModeToggle from "./components/DarkModeToggle.svelte";
    import InventoryEdit from "./components/InventoryEdit.svelte";
    import MaterialEdit from "./components/MaterialEdit.svelte";
    import {
        inventory,
        materials,
        materialsMap,
        removeInventoryItem,
    } from "./db";
    import type { InventoryItem, Material } from "./model";
    import {
        closeDialogs,
        editingInventoryItem,
        editingMaterial,
        isBackdrop,
        isEditInventory,
        isEditMaterial,
        materialToRemove,
        nuItem,
        nuMaterial,
        showEditInventoryItem,
        showEditMaterial,
        showRemoveMaterial,
    } from "./store";

    export let tab = 0;

    const editMaterial = (mat: Material) => {
        $editingMaterial = mat;
        showEditMaterial();
    };

    const editInventoryItem = (item: InventoryItem | undefined) => {
        if (item) {
            $editingInventoryItem = { ...item };
        }
        showEditInventoryItem();
    };

    const removeItem = async (item: InventoryItem) => {
        if (!item.id) {
            return;
        }
        try {
            await removeInventoryItem(item.id);
        } catch (error) {
            alert("Erro ao remover item");
        }
    };

    const getCost = (item: InventoryItem) => {
        let cost = 0;
        item.recipe?.forEach((ing) => {
            cost += ing.qty * $materialsMap[ing.id].price;
        });

        return cost;
    };
</script>

<nav>
    <button class="nav-btn" class:active={tab == 0} on:click={() => (tab = 0)}
        >Materiais
    </button>
    <button class="nav-btn" class:active={tab == 1} on:click={() => (tab = 1)}
        >Inventario
    </button>
    <div class="separator" />
    <DarkModeToggle />
</nav>

{#if tab == 1 && $inventory && $materials}
    <main id="inventory">
        <h2>Inventario</h2>
        <table>
            <thead>
                <tr>
                    <th>foto</th>
                    <th>id</th>
                    <th>nome</th>
                    <th>receita</th>
                    <th class="txt-center">custo</th>
                    <th class="txt-center">preco</th>
                    <th class="txt-center">qty</th>
                    <th class="actions-column">ações</th>
                </tr>
            </thead>
            <tbody id="inventoryBody">
                {#each $inventory as item}
                    <tr>
                        <td><img src={item.thumb} alt="thumb" /></td>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                            <table>
                                <thead>
                                    <tr>
                                        <th>nome</th>
                                        <th>qtd</th>
                                        <th>preço</th>
                                        <th>total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#if item.recipe}
                                        {#each item.recipe as ingredient}
                                            <tr>
                                                <td
                                                    >{$materialsMap[
                                                        ingredient.id
                                                    ].name}</td
                                                >
                                                <td
                                                    >{item.qty}{$materialsMap[
                                                        ingredient.id
                                                    ].unit}</td
                                                >
                                                <td
                                                    >R${$materialsMap[
                                                        ingredient.id
                                                    ].price}</td
                                                >
                                                <td>
                                                    {item.qty *
                                                        $materialsMap[
                                                            ingredient.id
                                                        ].price}
                                                </td>
                                            </tr>
                                        {/each}
                                    {/if}
                                </tbody>
                            </table>
                        </td>
                        <td>R${getCost(item)}</td>
                        <td>R${item.price}</td>
                        <td>{item.qty}</td>
                        <td>
                            <div class="actions">
                                <button
                                    on:click={() => editInventoryItem(item)}
                                >
                                    ✏️
                                </button>
                                <button on:click={() => removeItem(item)}>
                                    🗑️
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <div class="end" style="margin-top: 20px;">
            <button
                class="bg-accent"
                type="button"
                on:click={() => editInventoryItem(nuItem())}
                >Adicionar produto
            </button>
        </div>
    </main>
{/if}
{#if tab == 0 && $materials}
    <main id="materials">
        <h2>Materiais</h2>

        <table>
            <thead>
                <tr>
                    <th style="width: 80px">id</th>
                    <th>produto</th>
                    <th class="txt-center" style="width: 80px">unidade</th>
                    <th class="txt-center" style="width: 80px">preco</th>
                    <th class="actions-column">acoes</th>
                </tr>
            </thead>
            <tbody id="materialsBody">
                {#each $materials as material}
                    <tr>
                        <td>{material.id}</td>
                        <td>{material.name}</td>
                        <td>{material.unit}</td>
                        <td>{material.price}</td>
                        <td>
                            <div class="actions">
                                <button
                                    type="button"
                                    on:click={() => editMaterial(material)}
                                >
                                    ✏️
                                </button>
                                <button
                                    type="button"
                                    on:click={() =>
                                        showRemoveMaterial(material)}
                                    >🗑️
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <div class="end" style="margin-top: 20px;">
            <button
                class="bg-accent"
                type="button"
                on:click={() => editMaterial(nuMaterial())}
                >Adicionar material
            </button>
        </div>
    </main>
{/if}

<button id="dialogBackdrop" data-open={$isBackdrop} on:click={closeDialogs} />

{#if $isEditMaterial}
    <MaterialEdit />
{/if}

{#if $isEditInventory}
    <InventoryEdit />
{/if}

{#if $materialToRemove}
    <ConfirmRemoveMaterial />
{/if}

<style>
    table {
        width: 100%;
    }

    table,
    tr,
    th,
    td {
        border-collapse: collapse;
        border: var(--border);
    }

    th,
    td {
        height: 36px;
        padding: 0 10px;
        text-align: left;
    }

    th {
        text-transform: uppercase;
    }

    .end {
        display: flex;
        justify-content: flex-end;
    }

    #dialogBackdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: var(--mask-bg);
        backdrop-filter: blur(4px);
        opacity: 0;
        pointer-events: none;
        transition: 0.3s opacity ease;
    }

    #dialogBackdrop[data-open="true"] {
        opacity: 1;
        pointer-events: all;
    }

    table table,
    table table tr,
    table table th,
    table table td {
        border: none;
    }
</style>
