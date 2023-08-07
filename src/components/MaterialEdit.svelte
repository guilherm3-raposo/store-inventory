<script lang="ts">
    import { putMaterial } from "../db";
    import type { Material } from "../model";
    import {
        closeDialogs,
        editingMaterial,
        nuMaterial,
        showEditMaterial,
    } from "../store";
    import { halt } from "../util";

    /**
     * @param {any} mat
     */
    export const editMaterial = async (mat: Material) => {
        $editingMaterial = { ...mat };
        showEditMaterial();
    };

    /**
     *
     * @param {SubmitEvent} evt
     */
    const saveMaterial = async (evt: Event) => {
        halt(evt);
        try {
            $editingMaterial.price = ($editingMaterial.price || 0) - 0;
            const id = await putMaterial($editingMaterial);
            closeDialogs();
            $editingMaterial = nuMaterial();
            Promise.resolve(id);
        } catch (error) {
            alert("Erro adicionando material");
        }
    };
</script>

<dialog id="addMaterialDialog" open>
    <h2>Adicionar material</h2>

    <form on:submit={saveMaterial}>
        <div>
            <div class="form-field">Nome</div>
            <input
                bind:value={$editingMaterial.name}
                type="text"
                autocomplete="off"
                spellcheck="false"
                required
                style="max-width: 600px; width: 100%"
            />
        </div>
        <div>
            <div class="form-field">Unidade</div>
            <select bind:value={$editingMaterial.unit} name="unit" required>
                <option value="m">Metro</option>
                <option value="un">Unidade</option>
                <option value="kg">Kilograma</option>
                <option value="l">Litro</option>
            </select>
        </div>
        <div>
            <div class="form-field">Preco</div>
            <input
                bind:value={$editingMaterial.price}
                pattern="[0-9]+(.[0-9][0-9]?)?"
                type="text"
                required
            />
        </div>
        <div class="actions-footer">
            <button class="bg-accent" type="submit">Adicionar</button>
            <button type="reset">Limpar</button>
        </div>
    </form>
</dialog>
