<script lang="ts">
    import { browser } from "$app/environment";
    let { text } = $props();
</script>
<pre class="language-placeholder line-numbers">
        <code class="language-placeholder">{text}</code>
    </pre>
<link href="/app/libs/prism.css" rel="stylesheet" />
<!-- {#if colourMode == "light_default"} -->
    <!-- <link href="https://prismjs.catppuccin.com/latte.css" rel="stylesheet" /> -->
<!-- {:else} -->
<!-- {/if} -->
<!-- <link href="https://prismjs.catppuccin.com/mocha.css" rel="stylesheet" /> -->
{#if browser}
    <script src="/app/libs/prism.js"></script>
    <script>
        window.Prism = window.Prism || {};
        Prism.disableWorkerMessageHandler = true;
        prism.highlightAll();
    </script>
{/if}

<style>
    pre {
        border: 1px solid var(--border);
        border-radius: 0px;
    }
</style>
