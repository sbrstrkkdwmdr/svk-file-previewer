<script lang="ts">
    let {
        active = true,
        size = "60px",
        thickness = size,
        colour = "var(--theme-accent-primary)",
        duration = "0.5s",
    }: {
        active?: boolean;
        size?: string;
        thickness?: string;
        colour?: string;
        duration?: string;
    } = $props();
</script>

<div
    class="loader {active ? 'active' : ''}"
    id="loader"
    style="--size:{size};--thick:{thickness};--clr:{colour};--dur:{duration}"
></div>

<style>
    .loader {
        height: var(--size);
        width: var(--size);
        border-color: var(--clr) transparent var(--clr) transparent;
        border-width: calc(var(--thick) / 15);
        border-style: solid;
        border-image: initial;
        border-radius: 50%;
        padding: 3px;
        /* margin-right: 15px; */
        /* border-radius: 50%; */
        animation: none;
        transition: none;
        display: inline-block;
    }

    .loader.active {
        animation: var(--dur) linear infinite normal spin;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
