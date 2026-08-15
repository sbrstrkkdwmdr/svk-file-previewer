<script lang="ts">
    import { extToImage, extToType } from "$lib/data/extensions";
    import { type pathableItem } from "$lib/data/files";
    import type { Dict } from "$lib/data/types";
    import { fileNameParts, sort, type sortmodes } from "$lib/file-tools";
    import { fileTypeName, getMime, isPreviewable } from "$lib/data/filetypes";
    import { getLink } from "$lib/renders/share";
    import Ctxmenu from "$lib/components/inputs/ctxmenu.svelte";
    import Select from "$lib/components/bitui/select.svelte";
    import Icon from "$lib/components/icons/icon.svelte";
    import ButtonIcon from "$lib/components/icons/button-icon.svelte";
    import { formatBytes, separateNum, toCapital } from "$lib/tools";
    import { fade, scale } from "svelte/transition";
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

    type sortoptions = `${sortmodes}:${"up" | "down"}`;
    let sortmode: sortmodes = $state("name");
    let sortdirection: "up" | "down" = $state("down");
    let sortkey: sortoptions = $state("name:down");
    let sortfolders: "top" | "bottom" | "mixed" = $state("top");
    let filetypemode: "mime" | "name" | "ext" = $state("mime");

    const sortDict: Dict<[string, () => void], sortoptions> = {
        "name:down": [
            "Name (A-Z)",
            () => {
                ((sortmode = "name"), (sortdirection = "down"));
            },
        ],
        "name:up": [
            "Name (Z-A)",
            () => {
                ((sortmode = "name"), (sortdirection = "up"));
            },
        ],

        "size:down": [
            "Size (high-low)",
            () => {
                ((sortmode = "size"), (sortdirection = "down"));
            },
        ],
        "size:up": [
            "Size (low-high)",
            () => {
                ((sortmode = "size"), (sortdirection = "up"));
            },
        ],

        "ext:down": [
            "File extension (A-Z)",
            () => {
                ((sortmode = "ext"), (sortdirection = "down"));
            },
        ],
        "ext:up": [
            "File extension (Z-A)",
            () => {
                ((sortmode = "ext"), (sortdirection = "up"));
            },
        ],
        "mime:down": [
            "MIME type (A-Z)",
            () => {
                ((sortmode = "mime"), (sortdirection = "down"));
            },
        ],
        "mime:up": [
            "MIME type (Z-A)",
            () => {
                ((sortmode = "mime"), (sortdirection = "up"));
            },
        ],
    };

    function getChildren(
        container: pathableItem[],
        collection: pathableItem[],
    ) {
        for (const child of collection) {
            // if (child.type == "file") container.push(child);
            container.push(child);
            // if (isSearchResult && child.type == "folder")
            // getChildren(container, child.children);
            // else container.push(child);
        }
    }

    let sortedFiles: pathableItem[] = $derived.by(() => {
        const tmp: pathableItem[] = [];
        getChildren(tmp, files.children);
        sort(tmp, sortmode, sortdirection, sortfolders);
        return tmp;
    });

    function getPath(file: pathableItem) {
        if (file.type == "file") return "/open/" + file.hash;
        let path = file.directory + "/" + file.name;
        while (path.includes("//")) {
            path = path.replaceAll("//", "/");
        }
        return path.startsWith("/") ? path : "/" + path;
    }

    let filecount = $derived(
        sortedFiles.filter((f) => f.type == "file").length,
    );
    let foldercount = $derived(
        sortedFiles.filter((f) => f.type == "folder").length,
    );
</script>

<div>
    <Select
        type="single"
        bind:value={sortkey}
        onValueChange={() => {
            const entry = sortDict[sortkey];
            const fn = entry[1];
            fn();
        }}
        items={Object.entries(sortDict).map(([key, [name, fn]]) => {
            return {
                value: key,
                label: name,
                disabled: false,
            };
        })}
    >
        {#snippet trigger()}
            <span class="bitui icon-left">
                <Icon icon="filter" />
            </span>
            Sort
            <span class="bitui icon-right">
                <Icon icon="chevronDown" colour="var(--theme-text-secondary)" />
            </span>
        {/snippet}
        {#snippet item(value, label, disabled, selected)}
            <span style={selected ? "color:var(--theme-enable-);" : ""}>
                {#if selected}
                    <Icon icon="check" colour="inherit" />
                {/if}
                {label}
            </span>
        {/snippet}
    </Select>
    <Select
        type="single"
        bind:value={sortfolders}
        items={[
            {
                value: "top",
                label: "Top of list",
                disabled: false,
            },
            {
                value: "mixed",
                label: "Mixed with files",
                disabled: false,
            },
            {
                value: "bottom",
                label: "Bottom of list",
                disabled: false,
            },
        ]}
    >
        {#snippet trigger()}
            <span class="bitui icon-left">
                <Icon icon="folder" />
            </span>
            Folders
            <span class="bitui icon-right">
                <Icon icon="chevronDown" colour="var(--theme-text-secondary)" />
            </span>
        {/snippet}
        {#snippet item(value, label, disabled, selected)}
            <span style={selected ? "color:var(--theme-enable-);" : ""}>
                {#if selected}
                    <Icon icon="check" colour="inherit" />
                {/if}
                {label}
            </span>
        {/snippet}
    </Select>
    <Select
        bind:value={filetypemode}
        type="single"
        items={[
            {
                value: "mime",
                label: "MIME type",
                disabled: false,
            },
            {
                value: "name",
                label: "Type name",
                disabled: false,
            },
            {
                value: "ext",
                label: "File extension",
                disabled: false,
            },
        ]}
    >
        {#snippet trigger()}
            <span class="bitui icon-left">
                <Icon icon="fileText" />
            </span>
            File types
            <span class="bitui icon-right">
                <Icon icon="chevronDown" colour="var(--theme-text-secondary)" />
            </span>
        {/snippet}
        {#snippet item(value, label, disabled, selected)}
            <span style={selected ? "color:var(--theme-enable-);" : ""}>
                {#if selected}
                    <Icon icon="check" colour="inherit" />
                {/if}
                {label}
            </span>
        {/snippet}
    </Select>
</div>
<div>
    {#if sortedFiles.length == filecount}
        {filecount} files
    {:else if sortedFiles.length == foldercount}
        {foldercount} folders
    {:else}
        {sortedFiles.length} items ({filecount} files, {foldercount} folders)
    {/if},
    {@html formatBytes(sortedFiles.reduce((a, b) => b.size + a, 0))}
</div>
{#snippet dirbutton()}
    <ButtonIcon
        tooltip="Reverse file sorting"
        icon="chevron{toCapital(sortdirection)}"
        callback={() => {
            sortdirection = sortdirection == "up" ? "down" : "up";
        }}
    />
{/snippet}
{#snippet fileEntry(file: pathableItem)}
    <a
        title={file.name}
        class="file"
        href={getPath(file)}
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
        {#if filetypemode == "name"}
            {#if file.type == "file"}
                {fileTypeName(file.name)}
            {:else}
                Directory
            {/if}
        {:else if filetypemode == "ext"}
            {#if file.type == "file"}
                {fileNameParts(file.name)?.[1] ?? ""}
            {/if}
        {:else}
            {#if file.type == "file"}
                {getMime(file.name)}
            {:else}
                directory
            {/if}
        {/if}
    </div>
{/snippet}
{#snippet fileResult(file: pathableItem)}
    <a
        title={file.name}
        class="file"
        href={getPath(file)}
        oncontextmenu={(ev) => ctxmenu(ev, file)}
        data-sveltekit-reload
    >
        {@render fileName(file)}
        {@render fileLocation(file)}
    </a>
{/snippet}
{#snippet fileLocation(file: pathableItem)}
    <div class="file-section mono-font">
        ~{(file.directory.startsWith("/")
            ? file.directory
            : "/" + file.directory
        ).replaceAll("//", "/")}
    </div>
{/snippet}
<div class="folder">
    {#if isSearchResult}
        <span class="header">
            <div class="file-section file-name">&ensp;&ensp;&ensp; Name</div>
            <div class="file-section">Location</div>
        </span>
        {#each sortedFiles as child}
            {@render fileResult(child)}
        {/each}
    {:else}
        <span class="header">
            <div class="file-section file-name">
                &ensp;&ensp;&ensp; Name{#if sortmode == "name"}{@render dirbutton()}{/if}
            </div>
            <div class="file-section">
                Size{#if sortmode == "size"}{@render dirbutton()}{/if}
            </div>
            <div class="file-section">
                Type{#if sortmode == "mime"}{@render dirbutton()}{/if}
            </div>
        </span>
        <a class="file" href="./">
            <div class="file-section file-name">
                <span class="fileIcon icon-fileGeneric icon-folder"></span>
                <span class="mono-font file-name-padding"> .. </span>
            </div>
            <div class="file-section mono-font"></div>
            <div class="file-section mono-font"></div>
        </a>
        {#each sortedFiles as file}
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
                desc={"~" +
                    (contextItem!.directory.startsWith("/")
                        ? contextItem!.directory
                        : "/" + contextItem!.directory) +
                    "/" +
                    contextItem!.name}
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
                        fileTypeName(contextItem!.name) +
                            " (" +
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
                        true,
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
                desc={"~" +
                    (contextItem!.directory.startsWith("/")
                        ? contextItem!.directory
                        : "/" + contextItem!.directory) +
                    "/"}
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
        background-color: var(--theme-bg-highlight);
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
        overflow-x: none;
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

    @media (max-width: 959px) {
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
