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
</script>

<div class="folder">
    <span class="header">
        <div class="file-section file-name">&ensp;&ensp;&ensp; Name</div>
        <div class="file-section">Size</div>
        <div class="file-section">MIME</div>
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
        <a
            class="file"
            href={file.type == "folder" ? file.directory : "/open/" + file.hash}
        >
            <div class="file-section file-name">
                <span
                    class="fileIcon icon-fileGeneric icon-{file.type == 'folder'
                        ? 'folder'
                        : extToImage(file.name.split('.')?.pop() ?? '')}"
                ></span>
                <span class="mono-font file-name-padding">
                    {file.name}
                </span>
            </div>
            <div class="file-section mono-font">
                {#if file.type == "folder"}
                    <span class="hide-on-shrink">
                        {file.children.length} item{file.children.length != 1
                            ? "s"
                            : ""}
                    </span>
                    <span class="show-on-shrink">
                        {@html formatBytes(file.size)}
                        ({file.children.length} item{file.children.length != 1
                            ? "s"
                            : ""})
                    </span>
                {:else}
                    {@html formatBytes(file.size)}
                {/if}
            </div>
            <div class="file-section mono-font">
                {#if file.type == "file"}
                    {getMime(file.name)}
                {:else}
                    folder
                {/if}
            </div>
        </a>
    {/each}
</div>

<style>
    .folder {
        /*display: flex;*/
        /*flex-direction: column;*/
        /*align-items: center;*/
    }
    .header {
        display: flex;
        align-items: center;
        padding: 4px;
        margin: 4px;
        border: 3px solid var(--none);
    }
    .file {
        display: flex;
        align-items: center;
        padding: 4px;
        margin: 4px;
        border: 3px solid var(--none);
        text-decoration: none; /* for some reason this is the only way to override the underline */
    }
    .file:hover {
        color: var(--theme-text-link-hover);
        border: 3px solid var(--theme-accent-primary);
    }
    .file-section {
        padding-left: 4px;
        padding-right: 4px;
        width: 150px;
        flex-shrink: 0;
    }
    .file-section {
        text-decoration: none;
    }
    .file-section.file-name {
        flex-grow: 1;
    }
    .file-section.file-name .file-name-padding {
        padding-left: 8px;
    }
    .file-section .fileIcon {
        font-size: 1.25rem;
    }

    @media only screen and (max-width: 600px) {
        /*.show-on-shrink {
        }*/
        .hide-on-shrink {
            display: none;
        }
    }

    @media (min-width: 599px) {
        .show-on-shrink {
            display: none;
        }
        /*.hide-on-shrink {
            display: none;
        }*/
    }
</style>
