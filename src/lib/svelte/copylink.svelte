<script lang="ts">
    let {
        url,
        icon = "icon-link",
        fsize = "18px",
        valign = "middle",
        title = "Copy link to clipboard",
        colour = "var(--text-main)",
        textGlowColour = "#fff",
    } = $props();
    function copyLinkRun(ev: MouseEvent) {
        const self = ev.target as HTMLElement;
        if (!self) return;
        toClipboard();
        animate(self);
    }
    function toClipboard() {
        navigator.clipboard.writeText(url);
    }
    function animate(self: HTMLElement) {
        self.classList.add("jump-active");
        setTimeout(() => {
            self.classList.remove(icon);
            self.classList.add("icon-check");
            setTimeout(() => {
                self.classList.add("dimSwitch");
                setTimeout(() => {
                    self.classList.remove("icon-check");
                    self.classList.add(icon);
                }, 250);
                setTimeout(() => {
                    self.classList.remove("dimSwitch");
                }, 500);
            }, 2500);
            setTimeout(() => {
                self.classList.remove("jump-active");
            }, 750);
        }, 190);
    }
    function glow(ev: Event) {
        const target = ev.target as HTMLElement;
        target.style.textShadow = `0 0 20px ${textGlowColour}, 0 0 40px ${textGlowColour}, 0 0 20px ${textGlowColour}`;
        target.style.color = textGlowColour;
    }
    function unglow(ev: Event) {
        const target = ev.target as HTMLElement;
        target.style.textShadow = "none";
        target.style.color = colour;
    }
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
    class="copyLink {icon}"
    style="display: inline-block; position: relative; vertical-align: {valign}; font-size: {fsize};"
    onclick={(ev) => {
        ev.stopPropagation();
        copyLinkRun(ev);
    }}
    onmouseover={glow}
    onfocus={glow}
    onmouseout={unglow}
    onblur={unglow}
    {title}
>
</button>

<style>
    button {
        border: none;
        background-color: var(--none);
        padding: 0;
        margin: 0;
        text-shadow: 0;
        transition: 0.3s ease;
    }
</style>
