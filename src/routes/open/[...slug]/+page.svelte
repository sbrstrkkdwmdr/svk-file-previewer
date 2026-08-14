<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { extToImage } from "$lib/data/extensions";
    import { addressBarPath } from "$lib/data/path-now.js";
    import AudioRender from "$lib/renders/audio-render.svelte";
    import CodeRender from "$lib/renders/code-render.svelte";
    import ImageRender from "$lib/renders/image-render.svelte";
    import MarkdownRender from "$lib/renders/markdown-render.svelte";
    import { getLink, getViewable } from "$lib/renders/share";
    import TextRender from "$lib/renders/text-render.svelte";
    import VideoRender from "$lib/renders/video-render.svelte";
    import Icon from "$lib/components/icons/icon.svelte";
    import { formatBytes, pathToAllFolderLinks, separateNum } from "$lib/tools";
    import { onMount } from "svelte";
    import { fileTypeName } from "$lib/data/filetypes";
    let { data } = $props();
    let viewMode = $derived(data.preview.mode);
    let colourMode = $state("dark_default");
    let innerWidth = $state(0);
    let showFilePreview = $derived.by(() => {
        return innerWidth > 1000;
    });
    let downloadurl = $derived(getLink(data.metadata, "download"));
    let viewLink = $derived(
        getViewable(data.metadata.hash, data.metadata.name),
    );
    onMount(() => {
        addressBarPath.set(data.metadata.directory);
    });
    afterNavigate(() => {
        addressBarPath.set(data.metadata.directory);
    });
    $effect(() => {
        try {
            localStorage.setItem("colourMode", colourMode);
        } catch (err) {
            console.log(err);
        }
        // showFilePreview = window.innerWidth > 900;
    });
    let [metadataWidth, metadataHeight] = $state([0, 0]);

    let forceTextMode = $state(false);
    let forceTextProcessed = $state(false);
    let ntext = $state("");
    async function forceText() {
        const url = viewLink;
        const data = await fetch(url).then((res) => res.text());
        ntext = data.trim();
    }
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
<a target="_self" href={data.metadata.directory} class="data-button">
    Go to folder
</a>
{@render renderContent()}

{#snippet parseFolder(fullpath: string, filename: string, hash: string)}
    {@const folders = pathToAllFolderLinks(fullpath)}
    <a href="/">~</a>{#each folders as [name, link]}
        /<a href={link}>{name}</a>
    {/each}/<a href="/open/{hash}">{filename}</a>
{/snippet}

{#snippet renderMetadata()}
    <div id="metadata" class="mono-font">
        <h2>{data.metadata.name}</h2>
        <Icon icon="folder" />
        {@render parseFolder(
            data.metadata.directory,
            data.metadata.name,
            data.metadata.hash,
        )}

        <br />
        <span title="File hash">
            <Icon icon="hash" />
            {data.metadata.hash}
        </span>
        <br />
        <span title="File size">
            <Icon icon="fileGeneric" />
            {formatBytes(data.metadata.size)}
            ({separateNum(data.metadata.size)} bytes)
        </span>
        <br />
        <a target="_blank" href={downloadurl + "?direct=true"} title="Download">
            <Icon icon="download" /> download
        </a>
        {#if viewMode != "file"}
            <br /><a
                target="_blank"
                href={downloadurl}
                title="Open file in browser"
            >
                <Icon icon="download" /> open file in browser
            </a>
        {/if}
        {#if data.downloadCount > 0}<br />
            <span title="Download count">
                <Icon icon="download" />
                {data.downloadCount} downloads
            </span>
        {/if}
        <br />
        <span title="MIME type">
            <Icon icon={extToImage(data.metadata.extension)} /> Type: {fileTypeName(
                data.metadata.name,
            )}
            ({data.mime})
        </span>
        {#if viewMode == "image" || viewMode == "video"}
            <br />
            <span title="Media Resolution (pixels)">
                <Icon icon="maximise" />
                {metadataWidth}x{metadataHeight}px
            </span>
        {/if}
        <hr />
    </div>
{/snippet}

{#snippet renderContent()}
    {@render renderMetadata()}
    <section id="data" class="centre-page">
        {#if viewMode == "markdown"}
            <MarkdownRender markdownText={data.preview.mdtext} {colourMode} />
            <hr />
            <h2>Raw text</h2>
            <CodeRender lang="md" code={data.preview.text} {colourMode} />
        {:else if viewMode == "code"}
            <CodeRender
                lang={data.preview.lang}
                code={data.preview.text}
                {colourMode}
            />
        {:else if viewMode == "text"}
            <TextRender text={data.preview.text} {colourMode} />
        {:else if viewMode == "audio"}
            <AudioRender src={viewLink} mime={data.mime} />
        {:else if viewMode == "image"}
            <ImageRender
                src={viewLink}
                bind:w={metadataWidth}
                bind:h={metadataHeight}
            />
        {:else if viewMode == "video"}
            <VideoRender
                src={viewLink}
                mime={data.mime}
                bind:w={metadataWidth}
                bind:h={metadataHeight}
            />
        {:else if viewMode == "disabled"}
            <TextRender
                text="File exceeds 50MB. Preview has been disabled"
                {colourMode}
            />
            {@render file()}
        {:else}
            {@render file()}
            {#if !data.preview.disabled}
                <button
                    class="data-button"
                    onclick={async (ev) => {
                        forceTextMode = !forceTextMode;
                        if (!forceTextProcessed) {
                            await forceText();
                            forceTextProcessed = true;
                        }
                    }}
                >
                    <Icon icon="eye" fsize="inherit" /> Preview as raw text
                </button>
                {#if forceTextMode}
                    <TextRender text={ntext} {colourMode} />
                {/if}
            {/if}
        {/if}
    </section>
{/snippet}
{#snippet file()}
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
    <button
        class="data-button"
        onclick={(ev) => {
            navigator.clipboard.writeText(downloadurl);
        }}
    >
        <Icon icon="copy" fsize="inherit" /> Copy direct link to clipboard
    </button>
{/snippet}

<style>
    .content hr {
        width: 99%; /* 100% extends past parent */
    }

    #data {
        /* overflow-y: auto; */
        /* height: 62vh; */
    }
    .data-button {
        font-family: "JetBrainsMono";
        text-align: center;
        font-size: 24px;
        background: none;
        color: var(--theme-text-link);
        border: solid 3px var(--theme-border);
    }

    .data-button:hover {
        color: var(--text-link-hover);
        text-decoration: underline;
        background-color: var(--theme-bg-highlight);
    }
</style>
