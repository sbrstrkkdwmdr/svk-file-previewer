<script lang="ts">
    let {
        url,
        icon = "icon-link",
        fsize = "18px",
        valign = "top",
        tooltip = "Copy link to clipboard",
        colour = "var(--theme-text-primary)",
        glowColour = "var(--theme-glow-button)",
        textGlowColour = "var(--theme-text-highlight)",
        defaultShadow = "none",
    } = $props();
    function copyLinkRun(ev: MouseEvent) {
        const self = ev.target as HTMLElement;
        if (!self) return;
        toClipboard();
        animate(self);
    }
    function toClipboard() {
        if (url.startsWith("/")) {
            navigator.clipboard.writeText(window.origin + url);
            return;
        }
        navigator.clipboard.writeText(url);
    }
    function animate(self: HTMLElement) {
        // 1 - jump
        self.classList.add("jump-active");
        setTimeout(() => {
            // 2 - switch icons at peak of jump
            self.classList.remove(icon);
            self.classList.add("icon-check");
            setTimeout(() => {
                // 4 - become transparent
                self.classList.add("switch-dim");
                setTimeout(() => {
                    // 5 - while transparent, switch icons
                    // TODO - fix "flash" upon icon switching
                    self.classList.remove("icon-check");
                    self.classList.add(icon);
                    // console.log(icon);
                    // self.classList.replace("icon-check", icon);
                    // self.className = self.className.replace("icon-check", "");
                }, 250);
                setTimeout(() => {
                    // 6 - become opaque
                    self.classList.remove("switch-dim");
                }, 500);
            }, 2500);
            setTimeout(() => {
                // 3 - remove jump
                self.classList.remove("jump-active");
            }, 750);
        }, 190);
    }
    function glow(ev: Event) {
        const target = ev.target as HTMLElement;
        target.style.textShadow = `0 0 20px ${glowColour}, 0 0 40px ${glowColour}, 0 0 20px ${glowColour}`;
        target.style.color = textGlowColour;
    }
    function unglow(ev: Event) {
        const target = ev.target as HTMLElement;
        target.style.textShadow = defaultShadow;
        target.style.color = colour;
    }
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
    aria-label="icon"
    class="copyLink {icon}"
    style="display: inline-block; vertical-align: {valign}; font-size: {fsize};text-shadow:{defaultShadow};color:{colour}"
    onclick={(ev) => {
        ev.stopPropagation();
        copyLinkRun(ev);
    }}
    onmouseover={glow}
    onfocus={glow}
    onmouseout={unglow}
    onblur={unglow}
    onload={unglow}
    title={tooltip}
>
</button>

<style>
    button {
        /* vertical-align: top; */
        border: none;
        background-color: var(--none);
        padding: 0;
        /* margin: 0; */
        transition: 0.3s ease;

        text-decoration: none;
    }

    @keyframes jump {
        0% {
            transform: translateY(0);
        }

        30% {
            transform: translateY(-8px);
        }

        60% {
            transform: translateY(2px);
        }

        100% {
            transform: translateY(0);
        }
    }

    @keyframes opacInOut {
        0% {
            opacity: 100;
        }

        50% {
            opacity: 0;
        }

        100% {
            opacity: 100;
        }
    }

    .jump-on-click {
        transition: transform 0.2s ease;
    }

    .jump-active {
        animation: jump 0.4s ease;
    }

    .switch-dim {
        animation: opacInOut 0.5s ease;
    }
</style>
