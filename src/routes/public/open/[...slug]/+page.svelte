<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { extToImage } from "$lib/data/extensions";
    import AudioRender from "$lib/renders/audio-render.svelte";
    import CodeRender from "$lib/renders/code-render.svelte";
    import FolderRender from "$lib/renders/folder-render.svelte";
    import ImageRender from "$lib/renders/image-render.svelte";
    import MarkdownRender from "$lib/renders/markdown-render.svelte";
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
    let downloadurl = $derived(`/api/download?hash=${data.metadata.hash}`);
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
<div class="sbsparent">
    {#if showFilePreview}
        <section class="sbs left">
            <h1>Files</h1>
            <FolderRender files={data.files} isChild={data.isChild} />
        </section>
    {/if}
    <section class="sbs right">
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
        <h2>File {data.metadata.name}</h2>
        <code>{data.metadata.directory}</code><br />
        <a target="_blank" href={downloadurl}>
            <Icon icon="download" /> download
        </a>
        <hr />
    </div>
    {#if viewMode == "markdown"}
        <MarkdownRender markdownText={data.text} {colourMode} />
    {:else if viewMode == "code"}
        <CodeRender lang={data.lang} code={data.text} {colourMode} />
    {:else if viewMode == "audio"}
        <AudioRender src={downloadurl + "&preview=true"} mime={data.mime} />
    {:else if viewMode == "image"}
        <ImageRender src={downloadurl + "&preview=true"} />
    {:else if viewMode == "text"}
        <TextRender text={data.text} />
    {:else if viewMode == "video"}
        <VideoRender src={downloadurl + "&preview=true"} mime={data.mime} />
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
