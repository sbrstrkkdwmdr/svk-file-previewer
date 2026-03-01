<script lang="ts">
    import { getMime } from "../MIME";
    let { src } = $props();
</script>


    <a href={src}>
        <img {src} alt="Preview" />
    </a>
<style>
    img {
        max-width: 100%;
        max-height: 100%;
    }
</style>