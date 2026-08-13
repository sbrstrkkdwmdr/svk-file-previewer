<script lang="ts">
    import { pagesToValues } from "$lib/tools";
    import { Pagination } from "bits-ui";
    import Icon from "$lib/components/icons/icon.svelte";
    type Props = {
        totalCount: number;
        perPage: number;
        currentPage: number;
    };
    let { totalCount, perPage, currentPage = $bindable() }: Props = $props();
    let pageMax = $derived(Math.ceil(totalCount / perPage));
    let showPages = $derived(pagesToValues(currentPage, pageMax));
</script>

<Pagination.Root count={totalCount} {perPage}>
    <Pagination.PrevButton
        class="bitui page-button {!(currentPage > 0) ? 'disabled' : ''}"
        onclick={() => {
            if (currentPage > 0) {
                currentPage--;
            }
        }}
    >
        <Icon icon="chevronLeft" colour="inherit" tooltip="Previous page" />
    </Pagination.PrevButton>
    {#each showPages as page}
        {#if typeof page == "string"}
            <span class="bitui page-button disabled">...</span>
        {:else}
            <Pagination.Page
                page={{
                    type: "page",
                    value: page,
                }}
                onclick={() => {
                    currentPage = page;
                }}
                class="bitui page-button {page == currentPage
                    ? 'active-page'
                    : ''}"
            >
                {page + 1}
            </Pagination.Page>
        {/if}
    {/each}
    <Pagination.NextButton
        class="bitui page-button {!(currentPage < pageMax - 1)
            ? 'disabled'
            : ''}"
        onclick={() => {
            if (currentPage < pageMax - 1) {
                currentPage++;
            }
        }}
    >
        <Icon icon="chevronRight" colour="inherit" />
    </Pagination.NextButton>
</Pagination.Root>

<!-- <style>
    :global(.bitui.page-button) {
        background-color: var(--clrs-none);
        color: var(--theme-text-primary);
        border-radius: 9px;
        border: none;
        width: fit-content;
        padding: 10px;
        margin: 0px 5px;
    }
    :global(.bitui.page-button:hover) {
        background-color: var(--theme-bg-highlight);
    }
    :global(.bitui.page-button.activePage) {
        background-color: var(--theme-text-primary);
        color: var(--theme-bg-secondary);
    }

    :global(.bitui.page-button.disabled) {
        color: var(--theme-text-secondary);
    }
    :global(.bitui.page-button.disabled:hover) {
        background-color: var(--none);
    }
</style> -->
