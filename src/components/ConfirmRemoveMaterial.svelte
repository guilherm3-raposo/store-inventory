<script lang="ts">
    import { inventory, removeMaterial, putInventoryItem } from "../db";
    import type { InventoryItem, Material } from "../model";
    import { closeDialogs, materialToRemove } from "../store";

    let found: InventoryItem[] = [];

    const confirmRemove = async () => {
        if (!$materialToRemove.id) {
            return;
        }
        try {
            await removeMaterial($materialToRemove.id);

            let item: InventoryItem;
            for (const key in found) {
                item = found[key];
                for (const k in item.recipe || []) {
                    let id = item.recipe[k].id;
                    item.recipe = item.recipe.filter((i) => i.id !== id);
                }
                await putInventoryItem(item);
            }

            $materialToRemove = null;
            closeDialogs();
        } catch (error) {
            alert("Erro ao remover material");
        }
    };

    const cancelRemove = () => {
        $materialToRemove = null;
        closeDialogs();
    };

    materialToRemove.subscribe((value) => {
        if (!value?.id) {
            return;
        }

        found = [];
        $inventory?.forEach((item: InventoryItem) => {
            found = found.concat(
                item.recipe?.filter((mat: Material) => mat.id == value.id)
            );
        });
        found = found;
    });
</script>

<dialog open>
    <h2>Atenção</h2>
    <div>
        <h2>Deseja realmente remover o material {$materialToRemove.name}</h2>
        {#if found.length}
            <b>Ele faz parte dos produtos:</b>
            <ul>
                {#each found as it}
                    <li>{it.name}</li>
                {/each}
            </ul>
        {/if}
    </div>
    <div class="actions-footer">
        <button class="bg-accent" on:click={confirmRemove}>Sim </button>
        <button on:click={() => cancelRemove}>Não </button>
    </div>
</dialog>
