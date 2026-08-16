<script>
    import Icon from "$lib/components/icons/icon-text-only.svelte";
</script>

<div class="special-footer">
    <a href="https://github.com/sbrstrkkdwmdr/svk-file-previewer"
        ><Icon icon="github-clear" /> Source code</a
    >
    | made by <a href="https://github.com/sbrstrkkdwmdr/">sbrstrkkdwmdr</a>
</div>

<style>
    .special-footer {
        text-align: left;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        padding: 8px;
        border-top: solid 3px var(--theme-border);
        border-right: solid 3px var(--theme-border);
        background-color: var(--theme-bg-primary);
        font-size: 11px;
    }
</style>
