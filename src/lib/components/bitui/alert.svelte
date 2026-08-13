<script lang="ts">
    import { AlertDialog } from "bits-ui";
    import type { Snippet } from "svelte";
    import { paletteValue, syncPalette } from "$lib/palette";
    import { onMount } from "svelte";
    type Props = {
        trigger: Snippet;
        title: string;
        description: string;
        success: Function;
        triggerStyle?: string;
        triggerClass?: string;
    };

    let {
        trigger,
        title,
        description,
        success,
        triggerClass,
        triggerStyle,
    }: Props = $props();
    onMount(() => {
        syncPalette();
    });
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger style={triggerStyle} class={triggerClass}>
        {@render trigger()}
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content
            class="underlay bitui alert-content"
            style="z-index:500;display: block;"
        >
            <section
                class="bitui alert-dialogue"
                style="border:3px solid var(--theme-border);"
            >
                <AlertDialog.Title><h3>{title}</h3></AlertDialog.Title>
                <AlertDialog.Description
                    ><p>{description}</p></AlertDialog.Description
                >
                <div>
                    <AlertDialog.Cancel class="bitui alert-button alert-cancel"
                        >Cancel</AlertDialog.Cancel
                    >
                    <AlertDialog.Action
                        class="bitui alert-button alert-confirm"
                        onclick={() => {
                            success();
                        }}>Confirm</AlertDialog.Action
                    >
                </div>
            </section>
        </AlertDialog.Content>
    </AlertDialog.Portal>
</AlertDialog.Root>
