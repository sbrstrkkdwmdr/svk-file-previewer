<script lang="ts">
    import { getMime } from "../MIME";
    let { src, mime } = $props();

</script>
    <audio controls>
        <source {src} type={mime} />
        Could not load audio
    </audio>
