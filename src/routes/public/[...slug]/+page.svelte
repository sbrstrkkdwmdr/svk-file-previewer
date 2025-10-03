<script lang="ts">
    import type { pathableItem } from "$lib/data/files";
    import { UrlParser } from "$lib/tools";
    import { onMount } from "svelte";
    import Fileviewer from "../fileviewer.svelte";
    import MarkdownRenderer from "../markdownRenderer.svelte";
    let { data } = $props();
    let viewMode = data.mode;
</script>

{#if viewMode == "folder"}
    <h1>Files</h1>
    <Fileviewer
        files={data.files}
    />
{:else if viewMode == "markdown"}
    <MarkdownRenderer markdownText={data.text} colourMode="dark_default" />
{:else}
    {data.text}
{/if}
