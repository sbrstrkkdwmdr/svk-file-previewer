<script lang="ts">
    import { getMime } from "../MIME";
    let { src, mime } = $props();
</script>
    <video controls>
        <source {src} type={mime} />
        <track kind="captions" />
        Could not load video
    </video>
    If video doesn't load, it might be encoded in a non-web friendly format such as HEVC
