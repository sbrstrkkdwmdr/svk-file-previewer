<script lang="ts">
    import AddressBar from "$lib/components/files/address-bar.svelte";
    import Icon from "$lib/components/icons/icon.svelte";
    import PaletteSelector from "$lib/components/inputs/palette-selector.svelte";
    import PaletteSelectorIcon from "$lib/components/inputs/palette-selector-icon.svelte";
    import ButtonIcon from "$lib/components/icons/button-icon.svelte";
    import { paletteValue } from "$lib/palette";
    let showPaletteSelector = $state(false);
</script>

<div class="header theme-{$paletteValue}">
    <PaletteSelectorIcon useExternalSelector={true} bind:showPaletteSelector />
    <a
        href="https://github.com/sbrstrkkdwmdr/svk-file-previewer"
        title="source code"
    >
        <Icon icon="github" fsize="40px" />
    </a>
    <AddressBar />
</div>
{#if showPaletteSelector}
    <span
        class="theme-{$paletteValue}"
        style="position:absolute;z-index:10001;overflow:auto; background: var(--theme-bg-secondary);
    border: 3px solid var(--theme-border);"
    >
        <ButtonIcon
            icon="cross"
            textGlowColour="var(--theme-disable-)"
            callback={() => {
                showPaletteSelector = false;
            }}
            fsize="2rem"
            tooltip="Close palette selector"
        />
        <PaletteSelector />
    </span>
{/if}

<style>
    .header {
        text-align: left;
        position: sticky;
        width: 100%;
        top: 0;
        background-color: var(--theme-bg-primary);
        padding: 8px;
        border-bottom: 3px solid var(--theme-border);
        /*overflow: none !important;*/
    }
</style>
