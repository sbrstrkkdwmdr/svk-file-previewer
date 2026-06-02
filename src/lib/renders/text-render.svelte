<script lang="ts">
    import { browser } from "$app/environment";
    import CodeRender from "./code-render.svelte";
    let { text, colourMode } = $props();
</script>

<CodeRender lang="text" code={text} {colourMode} />
