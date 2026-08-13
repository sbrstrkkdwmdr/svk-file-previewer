<script lang="ts">
    import type { Snippet } from "svelte";

    type props = {
        display: Snippet;
        children: Snippet<[]>;
    };

    let { display, children }: props = $props();

    let show = $state(false);
</script>

<button class="dialogue-btn" onclick={(ev) => (show = !show)}
    >{@render display()}
</button>
{#if show}
    <dialog class="dialogue-show">
        {@render children?.()}
    </dialog>
{/if}

<style>
    .dialogue-btn {
        background-color: var(--theme-bg-secondary);
        display: inline-block;
        width: fit-content;
        border: 1px solid var(--theme-border);
        font-size: 1rem;
        padding: 0.5em 1em;
        border-radius: 8px;
    }
    .dialogue-btn:hover {
        cursor: pointer;
        background-color: var(--theme-bg-highlight);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    .dialogue-show {
        border: 1px solid var(--theme-border);
        display: block;
    }
</style>
