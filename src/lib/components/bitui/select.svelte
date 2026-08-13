<script lang="ts">
    import { Select, type WithoutChildren } from "bits-ui";
    import type { Snippet } from "svelte";
    import { paletteValue, syncPalette } from "$lib/palette";
    import { onMount } from "svelte";

    type Props = WithoutChildren<Select.RootProps> & {
        placeholder?: string;
        items: { value: string; label: string; disabled: boolean }[];
        contentProps?: WithoutChildren<Select.ContentProps>;
        /**
         * what should be rendered inside the select box
         */
        trigger: Snippet<[string, any]>;
        /**
         * what item should be rendered per item
         *
         * params are (value, label, disabled, selected)
         */
        item: Snippet<[any, any, boolean, boolean]>;
        // any other specific component props if needed
    };

    let {
        value = $bindable(),
        items,
        contentProps,
        placeholder,
        trigger,
        item,
        ...restProps
    }: Props = $props();

    let open = $state(false);
    let label = $derived.by(() => {
        const filtered = items.filter((foo) => foo.value == value);
        if (filtered.length > 0) return filtered[0].label;
        return "aSelect an option";
    });
    onMount(() => {
        syncPalette();
    });
</script>

<Select.Root
    bind:open={open as never}
    bind:value={value as never}
    {...restProps}
>
    <Select.Trigger class="unset bitui select-trigger generic-select">
        {@render trigger(label, value)}
    </Select.Trigger>
    <Select.Portal>
        <Select.Content
            class="bitui select-content select-{open
                ? 'content-open'
                : 'content-closed'} theme-{$paletteValue}"
        >
            {#each items as { value, label, disabled } (value)}
                <Select.Item
                    class="bitui select-item {disabled ? 'disabled' : ''}"
                    {value}
                    {label}
                    {disabled}
                >
                    {#snippet children({ selected }: { selected: boolean })}
                        {@render item(
                            value,
                            label,
                            disabled ?? false,
                            selected,
                        )}
                        <span class="bitui select-spacefix"></span>
                    {/snippet}
                </Select.Item>
            {/each}
        </Select.Content>
    </Select.Portal>
</Select.Root>

<!-- <style>
    :global(.bitui.select) {
    }

    :global(.bitui.select-trigger) {
        background-color: var(--theme-bg-secondary);
        width: calc(max-content + 25px);
        border-radius: 9px;
        border: 3px solid var(--theme-border);
        touch-action: none;
        user-select: none;
        display: inline-flex;
        padding: 5px;
    }

    :global(.bitui.select-viewport) {
        width: 100%;
    }

    :global(.bitui.select-content) {
        z-index: 401;
        /* display: flex; */
        width: max-content;
        /* align-items: center;
    justify-items: center;
    justify-content: center;
    justify-self: center; */
        max-height: 300px;
        background-color: var(--theme-bg-secondary);
        border: 3px solid var(--theme-border);
        border-radius: 9px;
        overflow-x: hidden;
        overflow-y: auto;
        padding-inline-end: 25px;
    }


    :global(.bitui.select-item) {
        width: 100%;
        display: flex;
        height: 24px;
        touch-action: none;
        user-select: none;
        align-items: center;
        padding: 3px;
        padding-left: 5px;
        padding-right: 1.5px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    :global(.bitui.select-item:hover) {
        background-color: var(--theme-bg-highlight);
    }

    :global(.bitui.scrollup),
    :global(.bitui.scrolldown) {
        display: flex;
        width: 100%;
        align-items: center;
        justify-items: center;
        justify-content: center;
        justify-self: center;
    }

    :global(.bitui.icon-left) {
        margin-right: 5px;
    }

    :global(.bitui.icon-right) {
        margin-left: auto;
        /* right: 0px; */
        /* position:; */
    }
</style> -->
