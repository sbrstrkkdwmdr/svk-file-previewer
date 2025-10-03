<script lang="ts">
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
