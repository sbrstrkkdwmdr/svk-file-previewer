<script lang="ts">
    import type { KeyboardEventHandler } from "svelte/elements";
    import Icon from "./icon.svelte";
    let {
        placeholder,
        callback,
        isLoading,
        resultsCount,
        showResultsCount = true,
        initialValue = "",
    }: {
        placeholder: string;
        callback: KeyboardEventHandler<HTMLInputElement>;
        isLoading: boolean;
        resultsCount: number;
        showResultsCount?: boolean;
        initialValue?: string;
    } = $props();
    let searchIsEmpty = $state(true);
    let scount = $derived(resultsCount == 1 ? "result" : "results");
    let active = $derived(isLoading ? "active" : "");
</script>

<div class="searchContainer" style="text-align: center;">
    <div class="icon-input">
        <div>
            <Icon icon="search" fsize="24px" />
            <input
                type="search"
                {placeholder}
                onkeyup={async (ev) => {
                    await callback(ev);
                    const t = ev.target as HTMLInputElement;
                    searchIsEmpty = !Boolean(t.value);
                }}
                value={initialValue}
            />
        </div>
        {#if isLoading}
            <div
                style="display: inline-block;"
                class="loader {active}"
                id="loader"
            ></div>
        {:else if showResultsCount}
            <div
                class="resultsCounter"
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
    .searchContainer {
        display: inline-block;
        width: min(70%, 920px);
    }
    .icon-input {
        display: inline-flex;
        /* width: 250px; */
        width: 100%;
        background: none;
        background-color: var(--bg-item);
        border: 3px solid var(--border);
        justify-content: space-between;
    }
    :global(.icon-input i) {
        display: inline-block;
        padding: 3px;
    }
    .icon-input input {
        display: inline-block;
        width: calc(100% - 30px - 15px);
        font-size: 24px;
        background: none;
        border: 1px solid var(--none);
    }
    .loader {
        border: 5px solid var(--component-search-loader-inactive);
        padding: 3px;
        width: 15px;
        height: 15px;
    }
    .loader.active {
        border-top: 5px solid var(--component-search-loader-active);
    }
    .resultsCounter {
        height: 20px;
        padding: 0px 3px;
        margin: 6px;
        border-radius: 5px;
        text-align: center;
        vertical-align: middle;
        color: var(--bg-item);
        background-color: var(--component-search-results);
        /* display: inline-block; */
    }
</style>
