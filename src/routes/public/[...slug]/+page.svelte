<script lang="ts">
    import { browser } from "$app/environment";
    import { afterNavigate } from "$app/navigation";
    import { getColourMode } from "$lib/tools";
    import { onMount } from "svelte";
    import Codeblock from "../codeblock.svelte";
    import Fileviewer from "../fileviewer.svelte";
    import MarkdownRenderer from "../markdownRenderer.svelte";
    let { data } = $props();
    let viewMode = data.mode;
    let colourMode = $state("dark_default");
    let innerWidth = $state(0);
    let showFilePreview = $derived.by(() => {
        return innerWidth > 1000;
    });
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
<div>
    {#if viewMode == "folder"}
    <h1>Files</h1>
    <Fileviewer files={data.files} />
    {:else if showFilePreview}
    <div class="sbsparent">
        <section class="sbs left">
            <h1>Files</h1>
            <Fileviewer files={data.files} />
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
    {#if viewMode == "markdown"}
        <MarkdownRenderer markdownText={data.text} {colourMode} />
    {:else if viewMode == "code"}
        <Codeblock lang={data.lang} code={data.text} {colourMode} />
    {:else}
        {data.text}
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
        max-width: 30%;
        border-right: 3px solid var(--border);
    }
    .right {
        max-width: 70%;
        /* border-left: 3px solid var(--border); */
    }
</style>
