<script lang="ts">
	import Accordion from '$lib/accordion.svelte';
	import Breadcrums from '$lib/breadcrums.svelte';
	import Button from '$lib/button.svelte';
	import IconDelete from '$lib/icon-delete.svelte';
	import IconPlus from '$lib/icon-plus.svelte';
	import IconSettings_2 from '$lib/icon-settings-2.svelte';
	import IconTarget from '$lib/icon-target.svelte';
	import IconUser from '$lib/icon-user.svelte';
	import Select from '$lib/select.svelte';
	import Setting from '$lib/setting.svelte';
	import SimpleInput from '$lib/simple-input.svelte';
	import SimpleSelect from '$lib/simple-select.svelte';
	import Toggle from '$lib/toggle.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { Player } from './+page.server';
	import { dragHandleZone } from 'svelte-dnd-action';
	import { v4 as uuidv4 } from 'uuid';
	import IconRobot from '$lib/icon-robot.svelte';

	let { data } = $props();

	const { form, enhance } = superForm(data.form, {
		dataType: 'json'
	});

	let expandedAccordion: number | null = $state(2);
	function toggleAccordion(id: number) {
		if (expandedAccordion === id) {
			expandedAccordion = null;
			return;
		}
		expandedAccordion = id;
	}

	// Handle DND events
	function handleDndConsider(e: any) {
		$form.players = e.detail.items;
	}

	function handleDndFinalize(e: any) {
		$form.players = e.detail.items;
	}

	function addPlayer() {
		$form.players = [...$form.players, { id: uuidv4(), name: '', type: 'guest' }];
	}

	function removePlayer(idx: number) {
		if ($form.players.length <= 1) return;
		$form.players = $form.players.filter((_, index) => index !== idx);
	}

	function updatePlayerType(option: string, idx: number) {
		switch (option) {
			case 'guest':
				$form.players[idx] = { id: uuidv4(), name: '', type: 'guest' };
				break;
			case 'user':
				const disabledUsers = $form.players.map((player) => player.id);
				const enabledUsers: Player[] = data.players.reduce((t: Player[], n: Player) => {
					if (!disabledUsers.includes(n.id)) t.push(n);
					return t;
				}, []);
				$form.players[idx] = { ...enabledUsers[0], type: 'user' };
				break;
			case 'bot':
				$form.players[idx] = { ...data.bots[0], type: 'bot' };
				break;
		}
	}
</script>

<div>
	<Breadcrums path="/games/local" />
	<div
		class="bg-base relative mx-auto flex max-w-[var(--wrapper-width)] flex-col gap-2 rounded-sm px-7.5 py-6 shadow"
	>
		<div class="flex flex-col gap-7">
			<form method="POST" action="?/startGame" use:enhance>
				<div class="flex flex-col gap-4">
					<Accordion
						icon={IconTarget}
						text="Your dartboard"
						onclick={() => toggleAccordion(0)}
						expanded={expandedAccordion === 0}
						enabled={data.user?.settings?.dartboard}
					>
						<div
							class="bg-infoAlt text-txtPrimary flex flex-col gap-0.5 rounded-sm px-4 py-3 text-sm"
						>
							<span
								>Dartboard UUID: <span class="font-semibold"
									>{data.user?.settings?.dartboard || 'N/A'}</span
								></span
							>
						</div>
						<div class="text-txtHint mt-3 flex flex-col gap-2.5 text-sm/6">
							<div>
								To start a game, please turn on your dartboard hardware. The system needs it to
								detect darts and track your scores accurately. Without the hardware, you won’t be
								able to begin a game or register any throws. Make sure it's powered on and properly
								connected before continuing.
							</div>
							<div>
								Once the dartboard is turned on, its light will activate, indicating that it’s
								ready. You should also see the status sign change from 'Disabled' to 'Enabled,'
								confirming that the system has recognized your dartboard.
							</div>
							<div class="font-bold">
								If you haven’t linked your dartboard yet, you can do so in the settings or by
								clicking
								<a href="/settings" class="text-info">here</a>.
							</div>
						</div>
					</Accordion>
					<Select
						label="Game type"
						required={true}
						bind:current={$form.gameType}
						options={data.gameTypes}
					/>
					<div>
						<Accordion
							icon={IconSettings_2}
							text="Game settings"
							onclick={() => toggleAccordion(1)}
							expanded={expandedAccordion === 1}
							enabled={data.user?.settings?.dartboard}
						>
							<div class="text-txtHint text-sm/6">
								{$form.gameType.description}
							</div>
							<Toggle name="double_out" text="Double out" checked={true} />
						</Accordion>
						<Accordion
							icon={IconUser}
							text="Players"
							onclick={() => toggleAccordion(2)}
							expanded={expandedAccordion === 2}
							enabled={data.user?.settings?.dartboard}
						>
							<div class="align-center ml-1.5 flex items-center justify-between">
								<div class="text-txtHint text-sm">Maximum of 5 players</div>
								<Button
									left_icon={IconPlus}
									text="Add player"
									type="button"
									onclick={addPlayer}
									disabled={$form.players.length >= 5}
								/>
							</div>
							<div
								use:dragHandleZone={{
									items: $form.players,
									flipDurationMs: 200,
									type: 'players',
									dropTargetStyle: {}
								}}
								onconsider={handleDndConsider}
								onfinalize={handleDndFinalize}
								class="flex flex-col"
							>
								{#each $form.players as player, idx (player.id)}
									<Setting name="player_{idx}" bind:value={data.players[idx]}>
										{#if $form.players[idx].type === 'guest'}
											<SimpleInput
												class="flex-1"
												icon={IconUser}
												name="input_player_{idx}"
												placeholder="Player {idx + 1}"
												bind:value={$form.players[idx].name}
											/>
										{:else if $form.players[idx].type === 'user'}
											{@const disabledUsers = $form.players.map((player) => player.id)}
											<SimpleSelect
												class="flex-1"
												icon={IconUser}
												options={data.players}
												disabledOptions={disabledUsers}
												bind:value={$form.players[idx]}
											/>
										{:else if $form.players[idx].type === 'bot'}
											<SimpleSelect
												class="flex-1"
												icon={IconRobot}
												options={data.bots}
												bind:value={$form.players[idx]}
											/>
										{/if}

										{@const disabledTypes =
											$form.players.filter((player) => player.type === 'user')?.length ===
											data.players.length
												? ['user']
												: []}
										<SimpleSelect
											class="w-32"
											options={['user', 'guest', 'bot']}
											disabledOptions={disabledTypes}
											bind:value={$form.players[idx].type}
											onchange={(option: string) => updatePlayerType(option, idx)}
										/>
										<button
											onclick={() => removePlayer(idx)}
											class="text-dangerAlt hover:text-danger
											disabled:text-txtDisabled flex size-10.5 cursor-pointer
											items-center justify-center disabled:cursor-not-allowed"
											disabled={$form.players.length <= 1}
										>
											<IconDelete class="size-5" />
										</button>
									</Setting>
								{/each}
							</div>
							<div class="mt-3 ml-1.5 flex justify-between">
								<Toggle name="throw_for_bull" text="Throw for bull" checked={true} />
							</div>
						</Accordion>
					</div>
					<div class="mt-7.5 flex justify-end gap-4">
						<Button
							text="Start the game"
							type="submit"
							disabled={!data.user?.settings?.dartboard}
						/>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
