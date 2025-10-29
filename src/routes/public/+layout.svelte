<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    // import favicon from "$lib/assets/favicon.ico";
    import Icon from "$lib/svelte/icon.svelte";
    import { getColourMode } from "$lib/tools.js";
    import { onMount } from "svelte";
    let { data, children } = $props();
    let pageMeta = $state(data.headmeta);
    let colourMode = $state('dark_default');
    onMount(() => {
        layoutUpdate();
    });
    afterNavigate(() => {
    });
    function layoutUpdate() {
        pageMeta = data.headmeta;
        colourMode = getColourMode();
    }
    $effect(() => {
        try {
            localStorage.setItem("colourMode", colourMode);
        } catch (err) {
            console.log(err);
        }
    });
</script>

<svelte:head>
    {@html pageMeta}
    <!-- <link
        rel="icon"
        type="image/png"
        href="/icons/favicon-96x96.png"
        sizes="96x96"
    />
    <link
        rel="icon"
        type="image/png"
        href="/icons/favicon-64x64.png"
        sizes="64x64"
    />
    <link rel="shortcut icon" href="/icons/favicon.ico" />
    <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/apple-touch-icon.png"
    /> -->
</svelte:head>
<main class="theme-{colourMode}">
    <div class="layoutForcedSpecialButtons">
        <Icon
            icon="moon"
            callback={() => {
                if (colourMode == "light_default") {
                    colourMode = "dark_default";
                } else {
                    colourMode = "light_default";
                }
            }}
            altIcon="sun"
            altIconCondition={() => colourMode == "light_default"}
            fsize="40px"
            textGlowColour="var(--navSocialGlow)"
            glowColour="var(--navSocialGlowText)"
            glowOnHover={true}
        />
    </div>
    {@render children?.()}
</main>

<link rel="stylesheet" href="/app/styles/base.css" />
<link rel="stylesheet" href="/app/styles/palette.css" />
