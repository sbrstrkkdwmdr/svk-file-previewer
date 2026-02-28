<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { extToImage } from "$lib/data/extensions";
    import AudioRender from "$lib/renders/audio-render.svelte";
    import CodeRender from "$lib/renders/code-render.svelte";
    import FolderRender from "$lib/renders/folder-render.svelte";
    import ImageRender from "$lib/renders/image-render.svelte";
    import MarkdownRender from "$lib/renders/markdown-render.svelte";
    import { getLink } from "$lib/renders/share";
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
    let downloadurl = $derived(getLink(data.metadata, "download"));
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

<svelte:window bind:innerWidth />
<!-- {#if viewMode == "folder"}
        <h1>Files</h1>
        <FolderRender files={data.files} /> -->
<div class="content-container">
    {#if showFilePreview}
        <section class="content left">
            <h1>Files</h1>
            <FolderRender files={data.files} isChild={data.isChild} />
        </section>
    {/if}
    <section class="content right">
        {#if !showFilePreview}
            <a
                target="_self"
                href={data.metadata.directory}
                class="data-button"
            >
                Go to folder
            </a>
        {/if}

        {@render renderContent()}
    </section>
</div>

{#snippet renderContent()}
    <div id="metadata">
        <h2>{data.metadata.name}</h2>
        <code>{data.metadata.path}</code><br />
        <code>{data.metadata.hash}</code><br />
        <a target="_blank" href={downloadurl + "?direct=true"}>
            <Icon icon="download" /> download
        </a>
        {#if data.downloadCount > 0}({data.downloadCount}){/if}
        {#if viewMode != "file"}
            <br /><a target="_blank" href={downloadurl}>
                <Icon icon="download" /> Raw file
            </a>
        {/if}
        <hr />
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
        <VideoRender src={downloadurl} mime={data.mime} />
    {:else}
        <section id="data" class="centre-page">
            <Icon icon={extToImage(data.metadata.extension)} /> MIME type: {data.mime}
            <a target="_blank" href={downloadurl} class="data-button">
                <Icon icon="download" fsize="inherit" /> download
            </a>
            <button
                class="data-button"
                onclick={(ev) => {
                    navigator.clipboard.writeText(window.location.href);
                }}
            >
                <Icon icon="copy" fsize="inherit" /> Copy link to clipboard
            </button>
        </section>
    {/if}
{/snippet}

<style>
    .content-container {
        display: flex;
        flex-direction: row;
        text-align: left;
        max-width: 100%;
    }

    .content {
        height: calc(100% - 100px);
        overflow-x: auto;
        overflow-y: auto;
    }

    .content.left {
        padding-right: 15px;
        border-right: 3px solid var(--border);
        flex-basis: 30%;
    }
    .content.right {
        /* border-left: 3px solid var(--border); */
        /* flex-basis: 60%; */
        flex: 5 0 70%;
    }
    .content hr {
        width: 99%; /* 100% extends past parent */
    }

    .data-button {
        font-family: "JetBrainsMono";
        text-align: center;
        font-size: 24px;
        background: none;
        color: var(--text-link);
        border: solid 3px var(--border);
    }

    .data-button:hover {
        color: var(--text-link-hover);
        text-decoration: underline;
        background-color: var(--bg-highlight);
    }
</style>
