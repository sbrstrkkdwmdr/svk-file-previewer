<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { addressBarPath } from "$lib/data/path-now.js";
    import FolderRender from "$lib/renders/folder-render.svelte";
    import { getColourMode } from "$lib/tools";
    import { onMount } from "svelte";
    let { data } = $props();
    let colourMode = $state("dark_default");
    // let downloadurl = $state("./");
    onMount(() => {
        colourMode = getColourMode();
        addressBarPath.set(location.pathname);
    });
    afterNavigate(() => {
        colourMode = getColourMode();
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
</script>

<h1>Files</h1>
<FolderRender files={data.files} hasParent={data.isChild} />
