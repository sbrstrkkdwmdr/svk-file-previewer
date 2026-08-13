<script lang="ts">
    import { onMount } from "svelte";

    let {
        icon,
        inline = true,
        fsize = "1rem",
        tooltip,
        glowOnHover = false,
        colour = "var(--theme-text-primary)",
        textGlowColour = colour,
        glowColour = textGlowColour,
        usePresetColours = false,
        propStyle = "",
        defaultShadow = "none",
    }: {
        icon: string;
        inline?: boolean;
        fsize?: string;
        tooltip?: string;
        glowOnHover?: boolean;
        colour?: string;
        textGlowColour?: string;
        glowColour?: string;
        usePresetColours?: boolean;
        propStyle?: string;
        defaultShadow?: string;
    } = $props();

    let style = $derived(
        `font-size:${fsize};color:${colour};text-shadow:${defaultShadow};display${inline ? "inline-block" : "inline"}`,
    );
    let iconClass = $derived("icon-" + icon);
    function glow(ev: Event) {
        const target = ev.target as HTMLElement;
        if (glowOnHover) {
            target.style.textShadow = `0 0 20px ${glowColour}, 0 0 40px ${glowColour}, 0 0 20px ${glowColour}`;
        }
        if (!usePresetColours) {
            target.style.color = textGlowColour;
        }
    }
    function unglow(ev: Event) {
        const target = ev.target as HTMLElement;
        if (glowOnHover) {
            target.style.textShadow = defaultShadow;
        }
        if (!usePresetColours) {
            target.style.color = colour;
        }
    }
</script>

<i
    role="paragraph"
    title={tooltip}
    aria-label={tooltip}
    style="{style}{propStyle}"
    class={iconClass}
    onmouseover={glow}
    onfocus={glow}
    onmouseout={unglow}
    onblur={unglow}
    onload={unglow}
></i>

<style>
    i {
        vertical-align: top;
        border: none;
        background-color: var(--none);
        padding: 0;
        margin: 0;
        transition: 0.3s ease;

        text-decoration: none;
    }
</style>
