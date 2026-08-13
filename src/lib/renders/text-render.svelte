<script lang="ts">
    import CodeRender from "./code-render.svelte";
    let { text, colourMode } = $props();
</script>

<CodeRender lang="text" code={text} {colourMode} />
