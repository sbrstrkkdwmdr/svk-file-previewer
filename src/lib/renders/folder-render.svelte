<script lang="ts">
    import { invalidate, pushState } from "$app/navigation";
    import { extToImage, extToType, previewables } from "$lib/data/extensions";
    import { type pathableItem } from "$lib/data/files";
    import { getMime, isPreviewable } from "$lib/MIME";
    import { getLink } from "$lib/renders/share";
    import Ctxmenu from "$lib/svelte/ctxmenu.svelte";
    import Icon from "$lib/svelte/icon.svelte";
    import Searchbar from "$lib/svelte/searchbar.svelte";
    import {
        filesOnly,
        formatBytes,
        separateNum,
        stringMatches,
    } from "$lib/tools";
    import { onMount } from "svelte";
    import { fade, fly, scale, slide } from "svelte/transition";
    let {
        files,
        isSearchResult = false,
        hasParent = false,
    }: {
        files: pathableItem<"folder">;
        isSearchResult?: boolean;
        hasParent?: boolean;
    } = $props();

    let showContext = $state(false);
    let contextItem: pathableItem | null = $state(null);
    let mouseVector: [number, number] = $state([0, 0]);
    function ctxmenu(ev: MouseEvent | PointerEvent, child: pathableItem) {
        ev.preventDefault();
        contextItem = child;
        showContext = true;
        mouseVector[0] = ev.pageX;
        mouseVector[1] = ev.pageY;
    }

    function fileNameParts(str: string) {
        let name = str;
        let ext = "";
        if (str.includes(".")) {
            const temp = str.split(".");
            ext = temp.pop()!;
            name = temp.join(".");
        }
        let fullString = [name];
        if (ext.length > 0) fullString.push("." + ext);
        return fullString;
    }
</script>

{#snippet fileEntry(file: pathableItem)}
    <a
        title={file.name}
        class="file"
        href={file.type == "folder" ? file.directory : "/open/" + file.hash}
        oncontextmenu={(ev) => ctxmenu(ev, file)}
    >
        {@render fileName(file)}
        {@render fileSize(file)}
        {@render fileType(file)}
    </a>
{/snippet}
{#snippet fileName(file: pathableItem)}
    {@const parts = fileNameParts(file.name)}
    <div class="file-section file-name">
        <span
            class="fileIcon icon-fileGeneric icon-{file.type == 'folder'
                ? 'folder'
                : extToImage(file.name.split('.')?.pop() ?? '')}"
        ></span>
        <span class="mono-font file-name-padding">
            {parts[0]}{#if parts[1]}
                <span class="file-extension">{parts[1]}</span>{/if}
        </span>
    </div>
{/snippet}
{#snippet fileSize(file: pathableItem)}
    <div class="file-section mono-font">
        {#if file.type == "folder"}
            <span class="show-on-shrink">
                {file.children.length} item{file.children.length != 1
                    ? "s"
                    : ""}
            </span>
            <span class="hide-on-shrink">
                {@html formatBytes(file.size)}
                ({file.children.length} item{file.children.length != 1
                    ? "s"
                    : ""})
            </span>
        {:else}
            {@html formatBytes(file.size)}
        {/if}
    </div>
{/snippet}
{#snippet fileType(file: pathableItem)}
    <div class="file-section mono-font">
        {#if file.type == "file"}
            {getMime(file.name)}
        {:else}
            folder
        {/if}
    </div>
{/snippet}
{#snippet searchResults(file: pathableItem)}
    {#each file.children as child}
        {#if child.type == "file"}
            {@render fileResult(child)}
        {:else}
            {@render searchResults(child)}
        {/if}
    {/each}
{/snippet}
{#snippet fileResult(file: pathableItem)}
    <a
        title={file.name}
        class="file"
        href={file.type == "folder" ? file.directory : "/open/" + file.hash}
        oncontextmenu={(ev) => ctxmenu(ev, file)}
    >
        {@render fileName(file)}
        {@render fileLocation(file)}
    </a>
{/snippet}
{#snippet fileLocation(file: pathableItem)}
    <div class="file-section mono-font">
        ~{file.directory}
    </div>
{/snippet}
<div class="folder">
    {#if isSearchResult}
        <span class="header">
            <div class="file-section file-name">&ensp;&ensp;&ensp; Name</div>
            <div class="file-section">Location</div>
        </span>
        {@render searchResults(files)}
    {:else}
        <span class="header">
            <div class="file-section file-name">&ensp;&ensp;&ensp; Name</div>
            <div class="file-section">Size</div>
            <div class="file-section">Type</div>
        </span>
        {#if hasParent}
            <a class="file" href="..">
                <div class="file-section file-name">
                    <span class="fileIcon icon-fileGeneric icon-folder"></span>
                    <span class="mono-font file-name-padding"> .. </span>
                </div>
                <div class="file-section mono-font"></div>
                <div class="file-section mono-font">folder</div>
            </a>
        {/if}
        {#each files.children as file}
            {@render fileEntry(file)}
        {/each}
    {/if}
</div>
{#if showContext}
    <div
        transition:fade
        class="underlay"
        onclick={(ev) => {
            showContext = false;
        }}
        onkeypress={(ev) => {
            if (ev.key == "Enter") {
                showContext = false;
            }
        }}
        tabindex="0"
        role="button"
    ></div>
    <div
        transition:scale
        style="left:{mouseVector[0]}px;top:{mouseVector[1]}px;position:absolute;z-index:1000;"
    >
        {#if contextItem?.type == "file"}
            <Ctxmenu
                name={"File options"}
                desc={contextItem?.directory + "/" + (contextItem?.name ?? "")}
                mousevector={mouseVector}
                mousevectorOverridden={true}
                closeMenu={() => {
                    showContext = false;
                }}
                stats={{
                    "File size": [
                        "fileGeneric",
                        formatBytes(contextItem?.size ?? 0) +
                            ` (${separateNum(contextItem?.size ?? 0)} bytes)`,
                    ],
                    Type: [
                        extToImage(contextItem!.name.split(".")?.pop() ?? ""),
                        extToType(contextItem!.name.split(".")?.pop() ?? "") +
                            " (MIME: " +
                            getMime(contextItem!.name) +
                            ")",
                    ],
                    Downloads: [
                        "download",
                        (contextItem?.downloadCount ?? 0) + "",
                    ],
                }}
                links={{
                    Download: [
                        [
                            getLink(contextItem!, "download") + "?direct=true",
                            "_blank",
                        ],
                        "download",
                        true,
                    ],
                    Preview: [
                        [getLink(contextItem!, "preview"), "_self"],
                        "show",
                        isPreviewable(contextItem?.name ?? ""),
                    ],
                }}
                buttons={{
                    "Copy Link": [
                        () => {
                            let url =
                                window.origin +
                                getLink(contextItem!, "preview");
                            navigator.clipboard.writeText(url);
                        },
                        "link",
                        true,
                    ],
                }}
            />
        {:else}
            <Ctxmenu
                name={"Folder options"}
                desc={contextItem!.directory}
                mousevector={mouseVector}
                mousevectorOverridden={true}
                closeMenu={() => {
                    showContext = false;
                }}
                stats={{
                    "Folder size": [
                        "fileGeneric",
                        formatBytes(contextItem?.size ?? 0) +
                            ` (${separateNum(contextItem?.size ?? 0)} bytes)`,
                    ],
                    Children: [
                        "fileGeneric",
                        (contextItem?.children.length ?? 0) + "",
                    ],
                }}
                links={{
                    Preview: [
                        [
                            window.origin + /* "/" + */ contextItem!.directory,
                            "_self",
                        ],
                        "show",
                        true,
                    ],
                }}
                buttons={{
                    "Copy Link": [
                        () => {
                            let url =
                                window.origin + "/" + contextItem!.directory;
                            navigator.clipboard.writeText(url);
                        },
                        "link",
                        true,
                    ],
                }}
            />
        {/if}
    </div>
{/if}

<style>
    .folder {
        /*display: flex;*/
        /*flex-direction: column;*/
        /*align-items: center;*/
        display: table;
        row-gap: 80px;
    }
    .header {
        display: table-row;
        padding: 4px;
        margin: 4px;
        border: 3px solid var(--none);
    }
    .file {
        display: table-row;
        padding: 4px;
        margin: 4px;
        border: 3px solid var(--none);
        text-decoration: none; /* for some reason this is the only way to override the underline */
    }
    .file:hover {
        /*background-color: var(--theme-bg-highlight);*/
        /*outline: 0;*/
        background-color: var(--theme-bg-primary);
        box-shadow: 0 0 0 0.2rem
            color-mix(in srgb, var(--theme-accent-primary), transparent 50%);
        /* these two force the highlight to overlay neighbours */
        position: relative;
        z-index: 299;
    }
    .file:hover .file-section {
        color: var(--theme-text-link-hover);
    }
    .file-section {
        display: table-cell;
        padding-left: 8px;
        padding-right: 8px;
        padding-bottom: 4px;
        padding-top: 4px;
        text-decoration: none;
        text-wrap: nowrap;
        text-overflow: ellipsis;
    }
    .file-section.file-name .file-name-padding {
        padding-left: 8px;
        color: var(--theme-accent-primary);
    }
    .file-section.file-name .file-name-padding .file-extension {
        color: var(--theme-accent-tertiary);
    }

    .file-section .fileIcon {
        font-size: 1.25rem;
    }

    @media (max-width: 960px) {
        /*.show-on-shrink {
        }*/
        .hide-on-shrink {
            display: none;
        }
    }

    @media (min-width: 960px) {
        .show-on-shrink {
            display: none;
        }
        /*.hide-on-shrink {
            display: none;
        }*/
    }
</style>
