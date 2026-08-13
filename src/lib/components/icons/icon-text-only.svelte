<script lang="ts">
    import { onMount } from "svelte";

    let {
        icon,
        fsize = "1rem",
        title = "",
        propStyle = "",
        defaultShadow = "none",
    }: {
        icon: string;
        fsize?: string;
        title?: string;
        propStyle?: string;
        defaultShadow?: string;
    } = $props();

    let iconClass = $derived("icon-" + icon);
</script>

<i
    role="paragraph"
    aria-label="icon"
    style="font-size:{fsize};text-shadow:{defaultShadow};{propStyle}"
    class={iconClass}
    {title}
></i>

<style>
    i {
        color: inherit;
        vertical-align: top;
        border: none;
        background-color: var(--none);
        padding: 0;
        margin: 0;
        transition: 0.3s ease;
    }
    i:hover {
        color: inherit;
    }
</style>
