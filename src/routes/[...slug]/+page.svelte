<script lang="ts">
    import { afterNavigate, replaceState } from "$app/navigation";
    import { addressBarPath } from "$lib/data/path-now.js";
    import FolderRender from "$lib/renders/folder-render.svelte";
    import { onMount } from "svelte";
    import Searchbar from "$lib/components/inputs/searchbar.svelte";
    import type { pathableItem } from "$lib/data/files";
    import { fileSearch, type sortmodes } from "$lib/file-tools";
    let { data } = $props();
    let colourMode = $state("dark_default");

    let searchInitial = $state("");
    let previnVal = $state("");
    let usefiles = $derived(data.files);
    onMount(() => {
        addressBarPath.set(location.pathname);
        const url = new URL(window.location.href);
        const query = url.searchParams.get("q");
        if (query) {
            searchInitial = query;
            filterFiles(query);
            previnVal = query;
        }
    });
    afterNavigate(() => {
        addressBarPath.set(location.pathname);
    });
    $effect(() => {
        try {
            localStorage.setItem("colourMode", colourMode);
        } catch (err) {
            console.log(err);
        }
        // showFilePreview = window.innerWidth > 900;
    });

    let inTO: NodeJS.Timeout;
    let resultsAreLoading = $state(false);

    function filterFilesEvent(e: KeyboardEvent) {
        const val = (e.target! as HTMLInputElement).value?.trim() ?? "";
        console.log(val);
        if (previnVal != val) {
            clearTimeout(inTO);
            resultsAreLoading = true;
            inTO = setTimeout(() => {
                previnVal = val;
                filterFiles(val);
                resultsAreLoading = false;
                return;
            }, 500);
        }
    }
    function filterFiles(val: string) {
        const temp = fileSearch(data.files as pathableItem<"folder">, val);
        usefiles = temp;
        const nurl = new URL(window.location.href);
        nurl.searchParams.set("q", val);
        try {
            replaceState(nurl, {});
        } catch (err) {}
    }
</script>

<Searchbar
    placeholder="File name"
    callback={(ev) => filterFilesEvent(ev)}
    resultsCount={usefiles.children.length}
    isLoading={resultsAreLoading}
    showResultsCount={true}
    initialValue={searchInitial}
/>
<FolderRender
    files={usefiles}
    hasParent={data.isChild}
    isSearchResult={previnVal.trim() != ""}
/>
