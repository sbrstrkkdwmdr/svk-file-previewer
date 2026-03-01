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
    import {
        formatBytes,
        getColourMode,
        pathToAllFolderLinks,
        separateNum,
    } from "$lib/tools";
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
<!-- <div class="content-container"> -->
<!-- {#if showFilePreview}
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
    </section> -->
<!-- <div class="content"> -->
<!-- </div> -->
<!-- </div> -->
<div class="centre-page content">
    <a target="_self" href={data.metadata.directory} class="data-button">
        Go to folder
    </a>
    {@render renderContent()}
</div>

{#snippet parseFolder(fullpath: string, filename: string, hash: string)}
    {@const folders = pathToAllFolderLinks(fullpath)}
    <a href="/">root</a>{#each folders as [name, link]}
        /<a href={link}>{name}</a>
    {/each}/<a href="/open/{hash}">{filename}</a>
{/snippet}

{#snippet renderContent()}
    <div id="metadata">
        <h2>{data.metadata.name}</h2>
        <Icon icon="folder" />
        {@render parseFolder(
            data.metadata.directory,
            data.metadata.name,
            data.metadata.hash,
        )}

        <br />
        <Icon icon="hash" /> {data.metadata.hash}<br />
        <Icon icon="fileGeneric" /> {formatBytes(data.metadata.size)}
        ({separateNum(data.metadata.size)} bytes)<br />
        <a target="_blank" href={downloadurl + "?direct=true"}>
            <Icon icon="download" /> download
        </a>
        {#if viewMode != "file"}
            <br /><a target="_blank" href={downloadurl}>
                <Icon icon="download" /> raw file
            </a>
        {/if}
        {#if data.downloadCount > 0}<br /><Icon icon="download" />
            {data.downloadCount} downloads
        {/if}
        <br /><Icon icon={extToImage(data.metadata.extension)} /> MIME type: {data.mime}
        <hr />
    </div>
    <section id="data" class="centre-page">
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
        {/if}
    </section>
{/snippet}

<style>
    .content hr {
        width: 99%; /* 100% extends past parent */
    }

    #data {
        overflow-y: auto;
        height: 62vh;
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
