<script lang="ts">
    type props = {
        src: string;
        mime: string;
        w: number;
        h: number;
    };
    let { src, mime, w = $bindable(0), h = $bindable(0) }: props = $props();
    // let [w, h] = $state([0, 0]);
</script>

<video controls bind:videoWidth={w} bind:videoHeight={h}>
    <source {src} type={mime} />
    <track kind="captions" />
    Could not load video. Content may be encoded with an unsupported codec.
</video>
