<script lang="ts">
    import { palettes, type colourPalette, paletteValue } from "$lib/palette";
    import Icon from "$lib/components/icons/icon.svelte";
</script>

<section id="selector-palette" class="theme-{$paletteValue}">
    <table>
        <tbody>
            {#each Object.entries(palettes) as [key, [name, ico]]}
                {@const themepreviewfill = [
                    "--theme-bg-primary",
                    "--theme-bg-secondary",
                    "--theme-text-primary",
                    "--theme-accent-primary",
                    "--theme-accent-secondary",
                ]}
                <tr
                    class={$paletteValue == key ? "active" : ""}
                    onclick={() => {
                        paletteValue.set(key as colourPalette);
                    }}
                    onkeypress={(ev) => {
                        if (ev.key == "Enter") {
                            paletteValue.set(key as colourPalette);
                        }
                    }}
                    title="Switch theme to {name}"
                    tabindex="0"
                    role="button"
                >
                    <td>
                        <i
                            role="paragraph"
                            aria-label="icon"
                            style="font-size:20px;{$paletteValue == key
                                ? 'color:var(--theme-glow-button)'
                                : ''}"
                            class="icon-{ico}"
                        ></i>
                        {name}
                    </td>
                    <td class="theme-{key}">
                        {#if $paletteValue == key}
                            <Icon icon="chevronRight" />
                        {/if}
                        {#each themepreviewfill as style}
                            <span
                                class="themeprebox"
                                style="background-color:var({style})"
                            ></span>
                        {/each}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>

<style>
    #selector-palette {
        /* position: absolute; */
        /* top: 100%; */
        /* left: 0; */
        padding: 4px 0;
        min-width: 100px;
        width: max-content;
        display: block;
        /* z-index: 1002; */
    }
    .active {
        color: var(--theme-accent-primary);
        /* background-color: var(--theme-bg-highlight); */
    }

    .themeprebox {
        display: inline-block;
        width: 1rem;
        height: 1rem;
    }
    tr.active,
    td.active {
        border: 2px solid var(--theme-accent-primary);
    }
    tr:hover td:first-child *,
    tr:hover td:first-child {
        background-color: var(--theme-bg-highlight);
        color: var(--theme-text-link-hover);
    }
</style>
