<script lang="ts">
	// Import the static dartboard image
	import dartboardImage from '$lib/assets/dartboard2.svg'; // Update with your actual image path
	import { onMount } from 'svelte';

	let { dartX = 0, dartY = 0, zoomLevel = 3 } = $props();

	// Reference to the zoomed view container for direct DOM manipulation
	let zoomedView: HTMLDivElement;

	// Size of dartboard image (update with your actual dimensions)
	const dartboardWidth = 600;
	const dartboardHeight = 600;

	// Center point of the dartboard
	const centerX = dartboardWidth / 2;
	const centerY = dartboardHeight / 2;

	let actualX = $state(centerX + dartX * (300 / 17));
	let actualY = $state(centerY + -dartY * (300 / 17));

	onMount(() => {
		if (!zoomedView) return;

		// Calculate the background position for proper centering
		const backgroundPosX = -actualX * zoomLevel + zoomedView.offsetWidth / 2;
		const backgroundPosY = -actualY * zoomLevel + zoomedView.offsetHeight / 2;

		// Apply the transformation via CSS
		zoomedView.style.backgroundImage = `url(${dartboardImage})`;
		zoomedView.style.backgroundSize = `${dartboardWidth * zoomLevel}px ${dartboardHeight * zoomLevel}px`;
		zoomedView.style.backgroundPosition = `${backgroundPosX}px ${backgroundPosY}px`;
	});
</script>

<div class="mx-auto flex w-full flex-col gap-8 md:flex-row">
	<!-- Zoomed view of the dart position -->
	<div class="relative size-full">
		<div bind:this={zoomedView} class="aspect-[3/4] w-full overflow-hidden opacity-75"></div>
		<div
			class="bg-info absolute inset-0 mx-auto my-auto size-4 rounded-full border-3 border-white opacity-100 shadow-sm"
		></div>
	</div>
</div>
