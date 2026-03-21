<script lang="ts">
    type props = {
        src: string;
        mime: string;
        w: number;
        h: number;
    };
    let { src, mime, w = $bindable(0), h = $bindable(0) }:props = $props();
    // let [w, h] = $state([0, 0]);
</script>

<video controls bind:videoWidth={w} bind:videoHeight={h}>
    <source {src} type={mime} />
    <track kind="captions" />
    Could not load video
</video>
If video doesn't load, it might be encoded in a non-web friendly format such as HEVC
