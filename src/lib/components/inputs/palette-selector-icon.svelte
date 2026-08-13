<script lang="ts">
    import PaletteSelector from "$lib/components/inputs/palette-selector.svelte";
    import ButtonIcon from "$lib/components/icons/button-icon.svelte";
    import { paletteValue, palettes, type colourPalette } from "$lib/palette";
    import LinkIcon from "../icons/link-icon.svelte";
    // let showPaletteSelector = $state(false);
    let {
        useExternalSelector = false,
        showPaletteSelector = $bindable(false),
    }: {
        useExternalSelector?: boolean;
        showPaletteSelector?: boolean;
    } = $props();

    function paletteClick() {
        paletteToggle();
        paletteCycle();
    }

    function paletteCycle() {
        const keys = Object.keys(palettes) as colourPalette[];
        let idx = keys.indexOf($paletteValue);
        idx++;
        if (idx > keys.length - 1) idx = 0;
        $paletteValue = keys[idx];
    }

    function paletteToggle() {
        if ($paletteValue == "light_default") {
            $paletteValue = "dark_default";
        } else {
            $paletteValue = "light_default";
        }
        showPaletteSelector = false;
    }
</script>

<ButtonIcon
    tooltip="Switch between light and dark mode. Alt click to open palette selector."
    colour="var(--theme-text-secondary)"
    icon={$paletteValue.includes("light_")
        ? "sun"
        : $paletteValue.includes("dark_")
          ? "moon"
          : "star"}
    callback={() => paletteClick()}
    fsize="40px"
    textGlowColour="var(--theme-text-primary)"
    contextmenu={() => {
        showPaletteSelector = !showPaletteSelector;
    }}
/>
{#if showPaletteSelector && !useExternalSelector}
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
        <LinkIcon
            icon="settings"
            link="/settings"
            fsize="2rem"
            tooltip="Open settings menu"
        />
        <PaletteSelector />
    </span>
{/if}
