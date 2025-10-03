<script lang="ts">
    import { onMount } from "svelte";

    let {
        icon,
        inline = true,
        fsize = "1rem",
        callback,
        title = "",
        propagate = false,
        glowOnHover = false,
        colour = "var(--text-main)",
        textGlowColour = colour,
        glowColour = textGlowColour,
        altIcon = icon,
        altIconCondition,
        usePresetColours = false,
    }: {
        icon: string;
        inline?: boolean;
        fsize?: string;
        callback?: (ev: Event) => void;
        title?: string;
        propagate?: boolean;
        glowOnHover?: boolean;
        colour?: string;
        textGlowColour?: string;
        glowColour?: string;
        altIcon?: string;
        altIconCondition?: () => boolean;
        usePresetColours?: boolean;
    } = $props();

    let style = $state(`font-size:${fsize};color:${colour};`);
    let isAlt = $state(false);
    let iconClass = $derived("icon-" + (isAlt ? altIcon : icon));
    if (inline) {
        style += "display:inline-block;";
    } else {
        style += "display:block;";
    }
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
            target.style.textShadow = "none";
        }
        if (!usePresetColours) {
            target.style.color = colour;
        }
    }
    onMount(() => {
        setTimeout(() => {
            if (altIconCondition) isAlt = altIconCondition();
        }, 50);
    });
    function test() {
        return;
    }
</script>

{#if callback || altIconCondition}
    <button
        aria-label="icon"
        {style}
        class={iconClass}
        onclick={(ev) => {
            if (callback) callback(ev);
            if (altIconCondition) isAlt = altIconCondition();
            if (!propagate) {
                ev.stopPropagation();
            }
        }}
        onmouseover={glow}
        onfocus={glow}
        onmouseout={unglow}
        onblur={unglow}
        {title}
    ></button>
{:else}
    <i
        role="paragraph"
        aria-label="icon"
        {style}
        class={iconClass}
        onmouseover={glow}
        onfocus={glow}
        onmouseout={unglow}
        onblur={unglow}
        {title}
    ></i>
{/if}

<style>
    * {
        vertical-align: top;
        border: none;
        background-color: var(--none);
        padding: 0;
        margin: 0;
        text-shadow: 0;
        transition: 0.3s ease;
    }
</style>
