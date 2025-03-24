<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme');

		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	};
</script>

<form method="POST" use:enhance={submitUpdateTheme}>
	<ul>
		<li>
			<button class="text-text-primary hover:bg-tertiary" formaction="?/setTheme&theme=light"
				>Light</button
			>
		</li>
		<li>
			<button class="text-text-primary hover:bg-tertiary" formaction="?/setTheme&theme=dark"
				>Dark</button
			>
		</li>
		<!-- <li> -->
		<!-- 	<button formaction="?/setTheme&theme=rose-pine">Rose Pine</button> -->
		<!-- </li> -->
	</ul>
</form>
