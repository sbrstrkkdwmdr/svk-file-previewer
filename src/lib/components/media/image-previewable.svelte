<script lang="ts">
    // functionally identical to the image component
    // main diff is click to preview
    import Image from "$lib/components/media/image.svelte";
    import { imageError, type imageType } from "$lib/tools";
    import { fade, fly, scale } from "svelte/transition";
    type stringedBool = "true" | "false";
    let {
        alt,
        src,
        propsClass,
        title,
        type,
        width,
        height,
        style,
        draggable,
        loading,
        data_id,
        href,
        tabindex = 0,
    }: {
        alt: string;
        src: string | undefined;
        type: imageType;
        href?: string;
        title?: string;
        width?: string;
        height?: string;
        propsClass?: string;
        style?: any;
        draggable?: stringedBool;
        loading?: "eager" | "lazy";
        oninteract?: (ev: Event) => void;

        tabindex?: number;
        data_id?: string;
    } = $props();

    let showPreview = $state(false);

    function oninteract(ev: Event) {
        console.log("click!");
        showPreview = !showPreview;
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<Image
    {alt}
    {src}
    {width}
    {height}
    {loading}
    {propsClass}
    {style}
    {draggable}
    {title}
    {tabindex}
    {data_id}
    {oninteract}
    {type}
/>
{#if showPreview}
    <div class="preview" transition:fade={{ duration: 250 }}>
        <!-- underlay -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <Image
            {alt}
            {src}
            width="75vw"
            height="auto"
            href={src}
            {loading}
            propsClass="maximise-preview-img"
            {draggable}
            {title}
            {tabindex}
            {data_id}
            {type}
            aIsFullsize={true}
        />
    </div>
    <div
        transition:fade={{ duration: 250 }}
        class="underlay"
        onclick={oninteract}
        onkeypress={oninteract}
        tabindex="0"
        role="button"
    ></div>
{/if}

<style>
    .underlay {
        z-index: 800;
    }
    .preview {
        text-align: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 801;
        /* background-color: var(--theme-bg-secondary) ; */
        border: 3px solid var(--none);
        border-radius: 15px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 90vw;
        height: 90vh;
        padding: 15px;
        pointer-events: none;
    }
    :global(.maximise-preview-img) {
        max-width: 75%;
        object-fit: cover;
        border-radius: 0px;
        /* max-height: 80%; */
    }
</style>
