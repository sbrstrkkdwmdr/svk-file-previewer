<script lang="ts">
    // import { Clock as Circle } from "svelte-loading-spinners";
    import type { KeyboardEventHandler } from "svelte/elements";
    import Icon from "./icon.svelte";
    import Throbber from "./throbber.svelte";
    let {
        placeholder,
        callback,
        isLoading,
        resultsCount,
        showResultsCount = true,
        initialValue = "",
        id,
    }: {
        placeholder: string;
        callback: KeyboardEventHandler<HTMLInputElement>;
        isLoading: boolean;
        resultsCount: number;
        showResultsCount?: boolean;
        initialValue?: string;
        id?: string;
    } = $props();
    let searchIsEmpty = $state(true);
    // svelte-ignore state_referenced_locally
    if (initialValue) searchIsEmpty = false;
    // let scount = $derived(resultsCount == 1 ? "result" : "results");
    // let active = $derived(isLoading ? "active" : "");
</script>

<div class="search-container" style="text-align: center;">
    <div class="search-container-child">
        <Icon icon="search" fsize="24px" />
        <input
            type="search"
            class="fix-search-font"
            {id}
            {placeholder}
            onkeyup={async (ev) => {
                await callback(ev);
                const t = ev.target as HTMLInputElement;
                searchIsEmpty = !Boolean(t.value);
            }}
            value={initialValue}
            onload={(ev) => {
                if (initialValue) {
                    setTimeout(() => {
                        const event = new KeyboardEvent("keyup");
                        ev.target?.dispatchEvent(event);
                    }, 1000);
                }
            }}
        />
        {#if isLoading}
            <Throbber size="24px" />
            <!-- <Circle size="24" color="var(--accent-primary)"/> -->
        {:else if showResultsCount}
            <div
                class="results-counter"
                style={searchIsEmpty ? "background-color:var(--none);" : ""}
            >
                {#if searchIsEmpty}
                    ⠀
                {:else}
                    {resultsCount}
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .search-container {
        display: inline-block;
        width: min(70%, 920px);
    }
    .search-container-child {
        display: inline-flex;
        /* width: 250px; */
        width: 100%;
        background: none;
        background-color: var(--theme-bg-secondary);
        border: 3px solid var(--theme-border);
        justify-content: space-between;
    }

    .search-container-child:focus-within {
        background-color: var(--theme-bg-primary);
    }

    :global(.search-container-child i) {
        display: inline-block;
        padding: 3px;
    }
    .search-container-child input {
        display: inline-block;
        width: calc(100% - 60px);
        font-size: 24px;
        background: none;
        border: 1px solid var(--none);
    }
    .results-counter {
        height: 20px;
        padding: 0px 3px;
        margin: 6px;
        border-radius: 5px;
        text-align: center;
        vertical-align: middle;
        color: var(--theme-bg-secondary);
        background-color: var(--theme-accent-primary);
        /* display: inline-block; */
    }
    .fix-search-font {
        font-family: Inter, Arial, Helvetica, sans-serif;
    }
</style>
