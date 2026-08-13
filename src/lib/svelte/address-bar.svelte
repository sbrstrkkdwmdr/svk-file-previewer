<script lang="ts">
    import { onMount } from "svelte";
    import type { Dict } from "$lib/data/types";
    import { addressBarPath } from "$lib/data/path-now";
    let sections: [string, string][] = $derived.by(() => {
        const tmp: [string, string][] = [];
        let pathrn = [];

        for (const dir of $addressBarPath.split("/")) {
            pathrn.push(dir);
            let n = dir;
            if (dir == "") {
                continue;
            }
            const pair: [string, string] = [n, pathrn.join("/")];
            tmp.push(pair);
        }
        return tmp;
    });
</script>

{#snippet section(name: string, path: string)}
    <a class="address-bar-section" href={path}>{name}</a>/
{/snippet}
<span class="address-bar mono-font">
    {@render section("~", "/")}{#each sections as [name, path]}
        {@render section(name, path)}
    {/each}
</span>

<style>
    .address-bar {
        padding: 4px;
    }
    .address-bar-section {
        padding: 4px;
    }
</style>
