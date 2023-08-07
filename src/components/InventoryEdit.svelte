<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { materials, materialsMap, putInventoryItem } from "../db";
    import type { RecipeIngredient } from "../model";
    import { closeDialogs, editingInventoryItem, nuItem } from "../store";
    import { halt, thumbResizer } from "../util";

    let cost = writable(0);

    let nuRecipeItem: RecipeIngredient = {
        id: 0,
        qty: 1,
    };

    let recipeItem = writable({ ...nuRecipeItem });

    let imgFileElement: HTMLInputElement;
    let imgThumb = writable("");

    onMount(() => {
        thumbResizer(imgFileElement, imgThumb);
        imgThumb.subscribe((thumb) => {
            if (!thumb) {
                return;
            }
            $editingInventoryItem.thumb = thumb;
            $editingInventoryItem = $editingInventoryItem;
        });
    });

    /**
     *
     * @param {SubmitEvent} evt
     */
    const saveInventoryItem = async (evt: any) => {
        halt(evt);
        const id = await putInventoryItem($editingInventoryItem);
        $editingInventoryItem = nuItem();
        closeDialogs();
        Promise.resolve(id);
    };

    const addRecipeItem = () => {
        if (!$recipeItem.id || !$recipeItem.qty) {
            alert("Escolha um item e uma quantidade");
        }

        $recipeItem.qty = ($recipeItem.qty || 0) - 0;

        if (!$editingInventoryItem.recipe) {
            $editingInventoryItem.recipe = [];
        }

        $editingInventoryItem.recipe.push({ ...$recipeItem });

        $editingInventoryItem = $editingInventoryItem;

        recipeItem.set({ ...nuRecipeItem });
    };

    editingInventoryItem.subscribe((val) => {
        $cost = 0;

        val?.recipe?.forEach((ing) => {
            try {
                $cost += $materialsMap[ing.id].price * ing.qty || 0;
            } catch (error) {}
        });
    });
</script>

<dialog id="addInventoryItemDialog" open>
    <h2>
        {#if $editingInventoryItem?.id}
            Editar
        {:else}
            Adicionar
        {/if}
        produto
    </h2>

    <form id="newInventoryItem" on:submit={saveInventoryItem}>
        <div>
            <div>
                <div class="form-field">Imagem</div>
                <label>
                    <input
                        id="inventoryItemFile"
                        bind:this={imgFileElement}
                        accept="image/*"
                        type="file"
                        name="thumb"
                        hidden
                    />
                    <img
                        id="inventoryItemImg"
                        src={$editingInventoryItem.thumb}
                        alt=""
                    />
                </label>
            </div>
            <div>
                <div class="form-field">Nome</div>
                <input
                    bind:value={$editingInventoryItem.name}
                    type="text"
                    autocomplete="off"
                    spellcheck="false"
                    required
                    style="max-width: 600px; width: 100%"
                />
            </div>
            <div>
                <div class="form-field">Custo</div>
                <div>R${$cost}</div>
            </div>
            <div>
                <div class="form-field">Preco</div>
                <input
                    bind:value={$editingInventoryItem.price}
                    pattern="[0-9]+(.[0-9][0-9]?)?"
                    type="text"
                    required
                />
            </div>
            <div>
                <div class="form-field">Qty</div>
                <input
                    bind:value={$editingInventoryItem.qty}
                    type="number"
                    required
                />
            </div>
        </div>
        <div>
            <div>
                <div class="form-field">Novo item</div>
                <div class="flex gap-5">
                    <select class="flex1" bind:value={$recipeItem.id}>
                        {#if $materials}
                            {#each $materials as mat}
                                <option value={mat.id}>{mat.name}</option>
                            {/each}
                        {/if}
                    </select>
                    <input
                        bind:value={$recipeItem.qty}
                        pattern="[0-9]*(.[0-9][0-9]?)?"
                        type="text"
                        style="width: 54px;"
                    />
                    <button
                        on:click={addRecipeItem}
                        class="bg-accent"
                        type="button"
                        style="padding: 0px; width: 36px;"
                        >+
                    </button>
                </div>
            </div>
            <div style="flex: 1">
                <div class="form-field">Receita</div>
                <table id="materialsTable">
                    <thead>
                        <tr>
                            <th>item</th>
                            <th>preço</th>
                            <th>qtd</th>
                            <th>valor</th>
                            <th>remover</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#if $editingInventoryItem.recipe}
                            {#each $editingInventoryItem.recipe as ingredient, i}
                                <tr>
                                    <td>{$materialsMap[ingredient.id].name}</td>
                                    <td>{$materialsMap[ingredient.id].price}</td
                                    >
                                    <td>{ingredient.qty}</td>
                                    <td>
                                        R${$materialsMap[ingredient.id].price *
                                            ingredient.qty}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            on:click={() => {
                                                $editingInventoryItem.recipe?.splice(
                                                    i,
                                                    1
                                                );
                                                $editingInventoryItem =
                                                    $editingInventoryItem;
                                            }}
                                            >🗑️
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
            <div class="actions-footer">
                <button class="bg-accent" type="submit">Salvar</button>
                <button type="reset">Limpar</button>
            </div>
        </div>
    </form>
</dialog>

<style>
    form img {
        object-fit: contain;
        width: 128px;
        height: 128px;
        background-color: #ccc;
        border-radius: 12px;
        border: none;
    }

    #newInventoryItem {
        flex-direction: row;
        flex-wrap: wrap;
    }

    #newInventoryItem > * {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
</style>
