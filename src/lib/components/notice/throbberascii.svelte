<script lang="ts">
    const states = ["|", "/", "-", "\\"];
    let idx = $state(0);
    setInterval(async () => {
        idx++;
        if (idx > states.length - 1) {
            idx = 0;
        }
    }, 100);
</script>

{states[idx]}
