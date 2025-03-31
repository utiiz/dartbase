<script lang="ts">
	import '../../app.css';
	let { children } = $props();
</script>

<div class="bg-body size-full">
	{@render children()}
</div>
