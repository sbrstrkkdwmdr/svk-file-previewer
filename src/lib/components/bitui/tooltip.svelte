<script lang="ts">
    import { Tooltip } from "bits-ui";
    import { type Snippet } from "svelte";
    import { paletteValue, syncPalette } from "$lib/palette";
    import { onMount } from "svelte";
    type Props = Tooltip.RootProps & {
        /**
         * element that opens the popup
         */
        trigger: Snippet;
        triggerProps?: Tooltip.TriggerProps;
        // selectedTheme: colourPalette
    };

    let {
        open = $bindable(false),
        children,
        trigger,
        triggerProps = {},
        // selectedTheme,
        ...restProps
    }: Props = $props();
    onMount(() => {
        syncPalette();
    });
</script>

<Tooltip.Provider>
    <Tooltip.Root
        bind:open
        delayDuration={500}
        disableHoverableContent={true}
        {...restProps}
    >
        <Tooltip.Trigger
            class="unset bitui tooltip-trigger"
            style="display:inline;"
            {...triggerProps}
        >
            {@render trigger()}
        </Tooltip.Trigger>
        <Tooltip.Portal>
            <Tooltip.Content
                class="bitui tooltip-content {open
                    ? 'content-open'
                    : 'content-closed'} theme-${paletteValue}"
            >
                {@render children?.()}
            </Tooltip.Content>
        </Tooltip.Portal>
    </Tooltip.Root>
</Tooltip.Provider>

<!-- <style>
    :global(.tooltip-content) {
        z-index: 501;
        display: flex;
        background-color: var(--theme-bg-secondary);
        border: 3px solid var(--theme-border);
        border-radius: 9px;
        overflow-x: hidden;
        overflow-y: hidden;
        animation: jumpIn 0.2s;
    }
</style> -->
