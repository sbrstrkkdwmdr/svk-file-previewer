<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    let { markdownText, colourMode } = $props();

    onMount(async () => {
        setTimeout(() => {
            // fixMarkdown();
            // prism.highlightAll();
        }, 500);
    });
    function isLinkable(tag: string) {
        return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag);
    }
    function fixMarkdown() {
        const ps = document.getElementById("markdownData") as HTMLDivElement;
        let curh2 = "";
        let curh3 = "";
        let curh4 = "";
        let curh5 = "";
        let curh6 = "";
        for (const child of ps.children) {
            if (isLinkable(child.tagName.toLowerCase())) {
                const temp = child.innerHTML.toLowerCase().replaceAll(" ", "-");
                if (child.tagName.toLowerCase() == "h2") {
                    curh2 = temp;
                    curh3 = "";
                    curh4 = "";
                    curh5 = "";
                    curh6 = "";
                }
                if (child.tagName.toLowerCase() == "h3") {
                    curh3 = temp;
                    curh4 = "";
                    curh5 = "";
                    curh6 = "";
                }
                if (child.tagName.toLowerCase() == "h4") {
                    curh4 = temp;
                    curh5 = "";
                    curh6 = "";
                }
                if (child.tagName.toLowerCase() == "h5") {
                    curh5 = temp;
                    curh6 = "";
                }
                if (child.tagName.toLowerCase() == "h6") {
                    curh6 = temp;
                }
                const id = getId([curh2, curh3, curh4, curh5, curh6]);
                makeLinkable("#" + id, child as HTMLElement);
                child.id = id;
                child.classList.add("markdownHoverCopyable");
            }
        }
    }
    function getId(tags: string[]) {
        const use: string[] = [];
        for (const tag of tags) {
            if (tag.length > 0) use.push(tag);
        }
        return use.join("_");
    }
    function makeLinkable(clink: string, element: HTMLElement) {
        element.title = "Click to copy link to this element";
        element.addEventListener("click", () => {
            window.location.hash = clink;
            navigator.clipboard.writeText(window.location.href);
        });
    }
</script>
<div id="markdownData">
    {@html markdownText}
</div>

{#if colourMode == "light_default"}
    <link href="https://prismjs.catppuccin.com/latte.css" rel="stylesheet" />
{:else}
    <link href="https://prismjs.catppuccin.com/mocha.css" rel="stylesheet" />
{/if}
<link href="/app/styles/markdown.css" rel="stylesheet" />
{#if browser}
    <script src="/app/libs/prism.js"></script>
    <script>
        window.Prism = window.Prism || {};
        Prism.disableWorkerMessageHandler = true;
        prism.highlightAll();
    </script>
{/if}
