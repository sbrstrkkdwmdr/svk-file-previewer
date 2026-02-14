<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import AudioRender from "$lib/renders/audio-render.svelte";
    import CodeRender from "$lib/renders/code-render.svelte";
    import FolderRender from "$lib/renders/folder-render.svelte";
    import ImageRender from "$lib/renders/image-render.svelte";
    import MarkdownRender from "$lib/renders/markdown-render.svelte";
    import { downloadLink } from "$lib/renders/share";
    import TextRender from "$lib/renders/text-render.svelte";
    import VideoRender from "$lib/renders/video-render.svelte";
    import Icon from "$lib/svelte/icon.svelte";
    import { getColourMode } from "$lib/tools";
    import { onMount } from "svelte";
    let { data } = $props();
    let viewMode = data.mode;
    let colourMode = $state("dark_default");
    let innerWidth = $state(0);
    let showFilePreview = $derived.by(() => {
        return innerWidth > 1000;
    });
    let downloadurl = $state("./");
    onMount(() => {
        colourMode = getColourMode();
        setTimeout(() => {
            downloadurl = downloadLink();
        }, 500);
    });
    afterNavigate(() => {
        colourMode = getColourMode();
        setTimeout(() => {
            downloadurl = downloadLink();
        }, 500);
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
    {#if viewMode == "folder"}
    <h1>Files</h1>
    <FolderRender files={data.files} />
    {:else if showFilePreview}
    <div class="sbsparent">
        <section class="sbs left">
            <h1>Files</h1>
            <FolderRender files={data.files} />
        </section>
        <section class="sbs right">
            {@render renderContent()}
        </section>
    </div>
    {:else}
    {@render renderContent()}
    {/if}
</div>

{#snippet renderContent()}
<div>
    <a target="_blank" href={downloadurl}>
        <Icon icon="download" /> Click here for original file
    </a>
</div>
    {#if viewMode == "markdown"}
        <MarkdownRender markdownText={data.text} {colourMode} />
    {:else if viewMode == "code"}
        <CodeRender lang={data.lang} code={data.text} {colourMode} />
    {:else if viewMode == "audio"}
        <AudioRender src={downloadurl} mime={data.mime} />
            {:else if viewMode == "image"}
        <ImageRender src={downloadurl} />
            {:else if viewMode == "text"}
        <TextRender text={data.text} />
            {:else if viewMode == "video"}
        <VideoRender src={downloadurl} mime={data.mime}/>
        {:else}
        Error???
    {/if}
{/snippet}

<style>
    .sbsparent {
        text-align: left;
        max-width: 100%;
    }
    .sbs {
        display: inline-block;
        vertical-align: top;
    }
    .left {
        padding-right: 15px;
        width: fit-content;
        width: 30%;
        border-right: 3px solid var(--border);
        overflow-x: auto;
        height: 100%;
    }
    .right {
        max-width: 70%;
        /* border-left: 3px solid var(--border); */
    }
</style>
