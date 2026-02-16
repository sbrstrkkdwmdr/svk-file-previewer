<script lang="ts">
    import { invalidate, pushState } from "$app/navigation";
    import { extToImage, extToType, previewables } from "$lib/data/extensions";
    import { type pathableItem } from "$lib/data/files";
    import { getMime, isPreviewable } from "$lib/MIME";
    import { getLink } from "$lib/renders/share";
    import Ctxmenu from "$lib/svelte/ctxmenu.svelte";
    import Icon from "$lib/svelte/icon.svelte";
    import Searchbar from "$lib/svelte/searchbar.svelte";
    import { separateNum, stringMatches } from "$lib/tools";
    import { onMount } from "svelte";
    import { fade, fly, scale, slide } from "svelte/transition";
    let {
        files,
        showSearchbar = true,
        isChild = false,
    }: {
        files: pathableItem<"folder">;
        showSearchbar?: boolean;
        isChild?: boolean;
    } = $props();

    function openInCurrentWindow(item: pathableItem): boolean {
        const mime = getMime(item.name);
        const allow = ["text", "image", "video", "audio"];
        if (allow.some((x) => mime.startsWith(x))) return true;
        return false;
    }

    function fileShouldBuffer(filename: string) {
        for (const extension of previewables) {
            if (filename.endsWith("." + extension)) return false;
        }
        return true;
    }

    let usefiles = $state(forceOpenFolders(files));
    let searchInitial = $state("");
    onMount(async () => {
        const url = new URL(window.location.href);
        const query = url.searchParams.get("q");
        if (query) {
            searchInitial = query;
            filterFiles(query);
            previnVal = query;
        }
    });
    function formatBytes(bytes: number, decimals = 2, k = 1024) {
        if (!+bytes) return "0 Bytes";
        const dm = decimals < 0 ? 0 : decimals;
        let sizes = [
            "Bytes",
            "KiB",
            "MiB",
            "GiB",
            "TiB",
            "PiB",
            "EiB",
            "ZiB",
            "YiB",
        ];
        if (k == 1000) {
            sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        }
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function fileName(str: string) {
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
    let previnVal = "";
    function filterFilesEvent(e: KeyboardEvent) {
        const val = (e.target! as HTMLInputElement).value?.trim() ?? "";
        if (previnVal != val) {
            filterFiles(val);
            previnVal = val;
        }
    }
    function filterFiles(val: string) {
        const temp = checkFolder(files as pathableItem<"folder">, val);
        usefiles = temp;
        const nurl = new URL(window.location.href);
        nurl.searchParams.set("q", val);
        pushState(nurl, {});
    }
    function checkFolder(
        parent: pathableItem<"folder">,
        match: string,
    ): pathableItem<"folder"> {
        const temp: pathableItem<"folder"> = {
            ...parent,
        };
        temp.children = [];
        for (const file of parent.children) {
            if (
                file.type == "file" &&
                (stringMatches(file.name, match) ||
                    (stringMatches(file.directory, match) &&
                        file.directory != ""))
            ) {
                temp.children.push(file);
            } else if (file.type == "folder") {
                const newfolder = checkFolder(
                    file as pathableItem<"folder">,
                    match,
                );
                if (nonemptyFolder(newfolder)) {
                    temp.children.push(newfolder);
                }
            }
        }
        return forceOpenFolders(temp);
    }
    function forceOpenFolders(parent: pathableItem) {
        for (const child of parent.children) {
            child.forceInitialOpen =
                child.forceInitialOpen ||
                parent.children.length <= 2 ||
                child.children.length <= 2;
            if (child.type == "folder") {
                forceOpenFolders(child);
            }
        }
        return parent as pathableItem<"folder">;
    }

    function nonemptyFolder(parent: pathableItem<"folder">) {
        if (parent.children.length > 0) return true;
        return false;
    }
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
    function fileCount(item: pathableItem) {
        let n = 0;
        for (const child of item.children) {
            if (child.type == "folder") {
                n += fileCount(child);
            } else {
                n++;
            }
        }
        return n;
    }
    let fileNumber = $derived(fileCount(usefiles));
</script>

{#snippet folder(dir: pathableItem, isPrimary: boolean = false)}
    <details class="folder" open={isPrimary || dir.forceInitialOpen}>
        <summary
            class="file fileName mono"
            oncontextmenu={(ev) => ctxmenu(ev, dir)}
        >
            {dir.name}/
            <span class="fileExtra" style="white-space:collapse"
                >{dir.children.length} item{dir.children.length == 1 ? "" : "s"}
                ({@html formatBytes(dir.size)})</span
            >
        </summary>
        {#each dir.children as child}
            {#if child.type == "folder"}
                {@render folder(child)}
            {:else}
                <div
                    style="white-space-collapse: preserve;"
                    class="file fileName mono"
                    oncontextmenu={(ev) => ctxmenu(ev, child)}
                    role="button"
                    tabindex="0"
                >
                    <span></span>
                    <span
                        class="fileIcon icon-fileGeneric icon-{extToImage(
                            child.name.split('.')?.pop() ?? '',
                        )}"
                    ></span>
                    <a
                        target="_self"
                        class="fileName mono"
                        href={getLink(child, "preview")}
                    >
                        {fileName(
                            child.name,
                        )[0]}{#if fileName(child.name)[1]}<span
                                class="extension mono"
                                >{fileName(child.name)[1]}</span
                            >{/if}
                        <span class="fileExtra">
                            {@html formatBytes(child.size)}
                            {#if (child?.downloadCount ?? 0) > 0}
                                / <Icon
                                    icon="download"
                                    colour="var(--text-secondary)"
                                /><span class="downloadCount"
                                    >{child.downloadCount}</span
                                >
                            {/if}
                        </span>
                    </a>
                </div>
            {/if}
        {/each}
    </details>
{/snippet}
{#if files}
    {#if showSearchbar}
        <Searchbar
            placeholder="File name"
            callback={(ev) => filterFilesEvent(ev)}
            resultsCount={fileNumber}
            isLoading={false}
            showResultsCount={true}
            initialValue={searchInitial}
        /><br />
    {/if}
    {#if isChild}
        <div style="width:100%;text-align:left;margin-top: 10px;">
            <a
                href={(() => {
                    const temp = usefiles!.directory.split("/");
                    temp.pop();
                    return "/" + temp.join("/");
                })()}
                data-sveltekit-reload
                ><Icon icon="leave" /> to parent folder...
            </a><br />
        </div>
    {/if}
    {@render folder(usefiles!, true)}
{:else}
    <p class="pageSubtitle">There was an error trying to fetch files</p>
    <button
        onclick={async () => {
            invalidate("");
        }}>Retry</button
    >
{/if}
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
                    Downloads: [
                        "download",
                        (contextItem?.downloadCount ?? 0) + "",
                    ],
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
                }}
                links={{
                    Download: [
                        [getLink(contextItem!, 'download') + "?direct=true", "_blank"],
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
                            let url = window.origin + getLink(contextItem!, 'preview');
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
                        [window.origin + "/" + contextItem!.directory, "_self"],
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
    a,
    a:hover {
        text-decoration: none;
    }
    .fileIcon {
        vertical-align: sub;
    }

    summary {
        list-style: none;
        /* Removes the default arrow in Firefox */
        cursor: pointer;
        position: relative;
        padding-left: 30px;
        /* space for custom arrow */
    }

    details {
        padding-right: 30px;
    }

    /* Hide default arrow in WebKit browsers (Chrome, Safari) */
    summary::-webkit-details-marker {
        display: none;
    }

    /* Custom arrow (closed state) */
    summary::before {
        font-family: "icomoon" !important;
        content: "\e92f";
        position: absolute;
        left: 0;
        top: 0.2rem;
        width: 30px;
        height: 30px;
        transition: transform 0.2s ease;
    }

    /* When <details> is open, rotate or change the image */
    details[open] > summary::before {
        font-family: "icomoon" !important;
        content: "\e930";
        /* OR if you're using a rotating icon instead:
transform: rotate(90deg); */
    }

    .file {
        text-align: initial;
        transition: 0ms;
    }

    .file:hover {
        background-color: var(--bg-highlight);
    }

    .fileName {
        color: var(--accent-primary);
    }

    .extension {
        color: var(--accent-tertiary);
    }

    .fileExtra {
        color: var(--text-secondary);
    }

    .downloadCount {
        margin-left: 4px;
        color: inherit;
    }

    .folder {
        padding: 0px 30px;
    }

    .folder > summary.fileName {
        margin-left: -30px;
        /* pull summaries back to align left */
    }
    .underlay {
        background-color: var(--bg-under);
    }
</style>
