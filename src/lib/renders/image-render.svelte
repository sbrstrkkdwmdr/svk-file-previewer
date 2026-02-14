<script lang="ts">
    import { getMime } from "../MIME";
    let { src } = $props();
</script>


<section id="data" class="centre-page">
    <a href={src}>
        <img {src} alt="Preview" />
    </a>
</section>
<style>
    img {
        max-width: 100%;
        max-height: 100%;
    }
</style>