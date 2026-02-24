<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import FolderRender from "$lib/renders/folder-render.svelte";
    import { getColourMode } from "$lib/tools";
    import { onMount } from "svelte";
    let { data } = $props();
    let colourMode = $state("dark_default");
    // let downloadurl = $state("./");
    onMount(() => {
        colourMode = getColourMode();
    });
    afterNavigate(() => {
        colourMode = getColourMode();
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

<div class="content-container">
    <section class="content left">
        <h1>Files</h1>
        <FolderRender files={data.files} isChild={data.isChild} />
    </section>
</div>

<style>
    .content-container {
        /* display: flex; */
        /* flex-direction: row; */
        /* text-align: left; */
        max-width: 100%;
    }
    .content {
        height: calc(100vh - 100px);
        overflow-x: auto;
        overflow-y: auto;
    }

    .content.left {
    }
</style>
