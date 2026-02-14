<script lang="ts">
    import { getMime } from "../MIME";
    let { src, mime } = $props();

</script>
<section id="data" class="centre-page">
    <audio controls>
        <source {src} type={mime} />
        Could not load audio
    </audio>
</section>
