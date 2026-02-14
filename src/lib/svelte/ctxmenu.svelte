<script lang="ts">
    import type { Dict } from "$lib/data/types";
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import Icon from "./icon.svelte";
    const {
        name,
        desc,
        mousevector,
        mousevectorOverridden = false,
        buttons = {},
        links = {},
        stats = {},
        closeMenu = () => {},
    }: {
        name: string;
        desc: string;
        mousevectorOverridden?: boolean;
        mousevector: [number, number];
        buttons?: Dict<[() => void, string, boolean]>;
        links?: Dict<[[string, string], string, boolean]>;
        stats?: Dict<[string, string]>;
        closeMenu: Function;
    } = $props();
    let style = mousevectorOverridden
        ? ""
        : `left:${mousevector[0]}px;top:${mousevector[1]}px;`;

    function isInViewport(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
                (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    function viewportoffsetBy(elem: HTMLElement) {
        const rect = elem.getBoundingClientRect();
        return rect.bottom - window.innerHeight;
    }
    const uuid = new Date().getTime();
    onMount(() => {
        const elem = document.getElementById("contextmenu-" + uuid)!;
        if (!isInViewport(elem)) {
            elem.style.transform = `translateY(-${viewportoffsetBy(elem)}px)`;
        }
    });
</script>

<section id="contextmenu-{uuid}" class="contextmenu" {style} transition:scale>
    {#if closeMenu}
        <Icon
            icon="cross"
            callback={() => closeMenu()}
            glowOnHover={true}
            colour="var(--text-main)"
            textGlowColour="var(--minimise)"
        />
    {/if}
    <h3>{name}</h3>
    <p class="mono">{desc}</p>
    <table class="ctxmenu-stats-table">
        <tbody>
            {#each Object.entries(stats) as [key, [icon, description]]}
                <tr>
                    <td><Icon {icon} /></td>
                    <td class="ctxmenu-stats mono">{key}</td>
                    <td class="ctxmenu-stats mono">{description}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    {#if Object.keys(stats).length > 0}
        <hr />
    {/if}
    {#each Object.entries(links) as [key, [[href, target], icon, enabled]]}
        {#if enabled}
            <a class="ctxItem" {href} {target}><Icon {icon} /> {key}</a>
        {:else}
            <button class="ctxItem disabled" disabled
                ><Icon
                    {icon}
                    colour="inherit"
                    title="this button is disabled"
                />
                {key}</button
            >
        {/if}
    {/each}
    {#each Object.entries(buttons) as [key, [fn, icon, enabled]]}
        {#if enabled}
            <button
                class="ctxItem"
                onclick={() => {
                    fn();
                    closeMenu();
                }}><Icon {icon} /> {key}</button
            >
        {:else}
            <button class="ctxItem disabled" disabled
                ><Icon
                    {icon}
                    colour="inherit"
                    title="this button is disabled"
                />
                {key}</button
            >
        {/if}
    {/each}
</section>

<style>
    .contextmenu {
        background-color: var(--bg-secondary);
        padding: 5px;
        width: max-content;
        position: absolute;
        z-index: 1001;
        border: 2px solid var(--border);
        border-radius: 5px;
    }
    .contextmenu .ctxItem {
        margin: 2.5px 0px;
        padding: 5px 2.5px;
        text-align: left;
        width: calc(100% - 10px);
        background-color: var(--none);
        display: block;
        border-radius: 5px;
        white-space: nowrap;
        border: none;
    }
    .contextmenu .ctxItem.disabled {
        color: var(--text-secondary);
        text-decoration: line-through;
    }
    .contextmenu .ctxItem:hover {
        background-color: var(--bg-highlight);
    }
    .ctxmenu-stats {
        text-align: left;
    }
    .ctxmenu-stats-table {
    }
    .ctxmenu-stats-table td:not(:last-child) {
        padding-right: 10px;
    }
    .ctxmenu-stats-table td:last-child {
        color: var(--accent-tertiary);
    }
    .contextmenu button {
    }
    .contextmenu button:hover {
        background-color: var(--highlight);
    }
    .contextmenu button:disabled {
        /* text-decoration: line-through; */
        color: var(--text-secondary);
    }
    .contextmenu button:hover:disabled {
        background-color: var(--none);
    }

    a, a.ctxItem {
        color: var(--text-primary);
    }
    a:hover {
        color: var(--text-primary);
        text-decoration: none;
    }
</style>
