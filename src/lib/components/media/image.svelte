<script lang="ts">
    import { imageError, type imageType } from "$lib/tools";
    type stringedBool = "true" | "false";
    let {
        alt,
        src,
        propsClass,
        title,
        type,
        width,
        height,
        style = "",
        draggable,
        oninteract,
        loading,
        data_id,
        href,
        tabindex = 0,
        aIsFullsize = false,
        target = "_blank",
    }: {
        alt: string;
        src: string | undefined;
        type: imageType;
        href?: string;
        title?: string;
        width?: string;
        height?: string;
        propsClass?: string;
        target?: "_blank" | "_self";
        style?: any;
        draggable?: stringedBool;
        loading?: "eager" | "lazy";
        oninteract?: (ev: Event) => void;

        aIsFullsize?: boolean;
        tabindex?: number;
        data_id?: string;
    } = $props();

    let whs = $derived(
        (width ? `width:${width};` : "") + (height ? `height:${height};` : ""),
    );

    let useStyle = $derived(style + whs);
    let txt = $derived("hello");
    // let useStyle = $derived(style);
</script>

{#snippet img()}
    {#if oninteract}
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
        <img
            {alt}
            {src}
            {loading}
            class={propsClass}
            style={useStyle}
            {draggable}
            {title}
            {tabindex}
            data-id={data_id}
            onerror={(ev) => {
                imageError(ev, type);
            }}
            onclick={(ev) => {
                oninteract(ev);
            }}
            onkeypress={(ev) => {
                if (ev.key == "Enter") {
                    oninteract(ev);
                }
            }}
            role="button"
        />
    {:else}
        <img
            {alt}
            {src}
            class={propsClass}
            style={useStyle}
            {draggable}
            {title}
            loading="lazy"
            data-id={data_id}
            onerror={(ev) => {
                imageError(ev, type);
            }}
        />
    {/if}
{/snippet}
{#if href}
    <a
        {href}
        style="display:inline-block;{aIsFullsize
            ? 'width:100%;height:100%;'
            : ''}"
    >
        {@render img()}
    </a>
{:else}
    {@render img()}
{/if}

<style>
    img {
        background-image: var(--img-fallback);
        background-position: center;
        /*background-repeat: no-repeat;*/
        background-size: contain;
        font-size: 0;
    }
</style>
