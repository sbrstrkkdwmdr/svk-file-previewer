<script lang="ts">
    import type { Snippet } from "svelte";
    import type { MouseEventHandler } from "svelte/elements";

    type props = {
        title?: string;
        id?: string;
        onclick?: MouseEventHandler<HTMLButtonElement> | null | undefined;
        liftOnHover?: boolean;
        isAnimated?: boolean;
        decorType?: number;
        customStyle?: string;
        children: Snippet<[]>;
    };
    let {
        title,
        id,
        onclick,
        liftOnHover = false,
        isAnimated = false,
        decorType = 1,
        customStyle = "",
        children,
    }: props = $props();

    let decorClass = $derived.by(() => {
        switch (decorType) {
            case 0:
                return "";
                default:
            case 1:
                return "button-decor-1";
            case 2:
                return "button-decor-2";
            case 3:
                return "button-decor-3";
        }
    });

    function showIfTrue(value: boolean, result: string) {
        if (value) return result;
        return "";
    }
</script>

<button
    {title}
    {id}
    class="{decorClass} {showIfTrue(liftOnHover, 'item-lift')} {showIfTrue(
        isAnimated,
        'button-animated',
    )}"
    style={customStyle}
    {onclick}>{@render children?.()}</button
>

<style>
    .button-animated {
        border-radius: 5px;
        border: 3px solid var(--theme-border);
        background-color: var(--theme-bg-secondary);
        transition: 0.2s ease;
    }

    .button-animated:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .button-animated:active {
        transform: translateY(-3px);
        background-color: var(--theme-bg-highlight);
    }

    .button-decor-1 {
        border: 3px solid var(--theme-border);
        background-color: var(--theme-bg-secondary);
    }

    .button-decor-1:hover {
        background-color: var(--theme-bg-highlight);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .button-decor-1:active {
        background-color: var(--theme-enable-);
    }

    .button-decor-2 {
        background-color: var(--theme-bg-secondary);
        display: inline-block;
        width: fit-content;
        border: 1px solid var(--theme-border);
        font-size: 1rem;
        padding: 0.5em 1em;
        border-radius: 8px;
    }

    .button-decor-2:hover {
        cursor: pointer;
        background-color: var(--theme-bg-highlight);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .button-decor-3 {
        background-color: var(--theme-bg-secondary);
        display: inline-block;
        width: fit-content;
        border: 3px solid var(--theme-border);
        font-size: 1rem;
        padding: 0.5em 1em;
        border-radius: 8px;
    }

    .button-decor-3:hover {
        cursor: pointer;
        background-color: var(--theme-bg-highlight);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
</style>
