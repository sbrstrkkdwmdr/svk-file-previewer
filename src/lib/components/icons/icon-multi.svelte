<script lang="ts">
    let {
        icon,
        count = 1,
        inline = true,
        fsize = "1rem",
        callback = () => {},
        title = "",
        propagate = false,
        glowOnHover = false,
        colour = "var(--theme-text-primary)",
        textGlowColour = "#fff",
        altIconCondition = () => {
            return false;
        },
    } = $props();

    let style = $derived(`font-size:${fsize};color:${colour};display${inline ? "inline-block" : "inline"}`);
    let isAlt = $state(false);
    function glow(ev: Event) {
        if (glowOnHover) {
            const target = ev.target as HTMLElement;
            target.style.textShadow = `0 0 20px ${textGlowColour}, 0 0 40px ${textGlowColour}, 0 0 20px ${textGlowColour}`;
            target.style.color = textGlowColour;
        }
    }Event
    function unglow(ev: Event) {
        if (glowOnHover) {
            const target = ev.target as HTMLElement;
            target.style.textShadow = "none";
            target.style.color = colour;
        }
    }
</script>

<button
    aria-label="icon"
    {style}
    onclick={(ev) => {
        callback();
        isAlt = altIconCondition();
        if (!propagate) {
            ev.stopPropagation();
        }
    }}
    onmouseover={glow}
    onfocus={glow}
    onmouseout={unglow}
    onblur={unglow}
    {title}
>
    {#each { length: count }, idx}
        <i class="icon-{icon} path{idx + 1}"></i>
    {/each}
</button>

<style>
    button {
        /* vertical-align: middle; */
        border: none;
        background-color: var(--none);
        padding: 0;
        margin: 0;
        /* font-size: 25px; */
        text-shadow: 0;
        transition: 0.3s ease;
    }
</style>
