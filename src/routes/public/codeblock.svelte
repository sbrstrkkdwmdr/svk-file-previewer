<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    let { code, lang, colourMode } = $props();
    console.log(lang)
    let fn = $state('')
    onMount(()=>{
        fn = window.location.pathname;
    })
</script>

<div>
    <code>{fn}</code>
    <pre class="language-{lang}">
        <code class="language-{lang}">{code}</code>
    </pre>
</div>
{#if colourMode == "light_default"}
    <link href="https://prismjs.catppuccin.com/latte.css" rel="stylesheet" />
{:else}
    <link href="https://prismjs.catppuccin.com/mocha.css" rel="stylesheet" />
{/if}
{#if browser}
    <script src="/app/libs/prism.js"></script>
    <script>
        window.Prism = window.Prism || {};
        Prism.disableWorkerMessageHandler = true;
        prism.highlightAll();
    </script>
{/if}

<style>
    * {
        text-align: left;
    }
    /* pre {
        background: none;
    } */
    code {
        /* background-color: var(--codeInline-bg); */
        color: var(--code);
        padding: 2px 6px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 0.95em;
    }
    pre code {
        display: block;
        /* border: var(--border) 3px solid; */
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 0.95em;
        white-space: pre;
        width: max-content;
        margin: 5px;
    }
</style>
