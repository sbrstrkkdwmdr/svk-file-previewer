<script lang="ts">
    type props = {
        src: string;
        w: number;
        h: number;
    };
    let { src, w = $bindable(0), h = $bindable(0) }:props = $props();
</script>

<a href={src}>
    <img {src} alt="Preview" bind:naturalHeight={h} bind:naturalWidth={w} />
</a>

<style>
    img {
        max-width: 100%;
        max-height: 100%;
    }
</style>
