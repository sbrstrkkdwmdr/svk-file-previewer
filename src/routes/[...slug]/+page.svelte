<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import FolderRender from "$lib/renders/folder-render.svelte";
    import { getColourMode } from "$lib/tools";
    import { onMount } from "svelte";
    let { data } = $props();
    let colourMode = $state("dark_default");
    let innerWidth = $state(0);
    // let downloadurl = $state("./");
    onMount(() => {
        colourMode = getColourMode();
        // setTimeout(() => {
        //     downloadurl = downloadLink();
        // }, 500);
    });
    afterNavigate(() => {
        colourMode = getColourMode();
        // setTimeout(() => {
        //     downloadurl = downloadLink();
        // }, 500);
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
<svelte:window bind:innerWidth />
<div>
    <h1>Files</h1>
    <FolderRender files={data.files} isChild={data.isChild} />
</div>