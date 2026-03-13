<script lang="ts">
    import { page } from "$app/state";
</script>

<h1>ERROR {page.status}</h1>
<div>{page.error!.message}</div>
<br /><br />
<div>
    <a href="/">Return to home page</a>
</div>
