import pb from '$lib/pocketbase';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { v4 as uuidv4 } from 'uuid';

const playerSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(['user', 'guest', 'bot'])
});
export type Player = z.infer<typeof playerSchema>;

const gameTypeSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	settings: z.record(z.string(), z.string().or(z.number())).nullable()
});
type GameType = z.infer<typeof gameTypeSchema>;

const gameSchema = z.object({
	visits: z.number(),
	players: z.array(playerSchema),
	gameType: gameTypeSchema
});
type Game = z.infer<typeof gameSchema>;


export const load: PageServerLoad = async () => {
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const gameTypes: GameType[] = await pb.collection('game_types').getFullList({
		sort: 'created',
		fields: 'id,name,description,settings'
	});

	let players: Player[] = await pb.collection('users').getFullList({
		sort: 'created',
		fields: 'id,name'
	});
	players = players.map(player => ({
		...player,
		type: 'user'
	}));

	players = players.sort((a, b) => {
		if (a.id === pb.authStore.model!.id) {
			return -1;
		}
		if (b.id === pb.authStore.model!.id) {
			return 1;
		}
		return 0;
	});

	const bots = [
		{ name: 'Bot Level 1', id: uuidv4(), type: 'bot' },
		{ name: 'Bot Level 2', id: uuidv4(), type: 'bot' },
		{ name: 'Bot Level 3', id: uuidv4(), type: 'bot' },
		{ name: 'Bot Level 4', id: uuidv4(), type: 'bot' },
		{ name: 'Bot Level 5', id: uuidv4(), type: 'bot' }
	];

	const form = await superValidate({
		visits: 10,
		players: [
			{ id: pb.authStore.model!.id, name: pb.authStore.model!.name, type: 'user' }
		],
		gameType: gameTypes[0]
	}, zod(gameSchema));

	return { form, gameTypes, players, bots };
};

export const actions: Actions = {
	startGame: async ({ request }) => {
		const form = await superValidate(request, zod(gameSchema));
		console.log(form);
		form.data.players.map((player: Player) => console.log(player));
		if (form.valid) {
			const game = await pb.collection('games').create({
				settings: {
					visits: form.data.visits,
				},
				type: form.data.gameType,
				players: form.data.players.map(player => player.id)
			});
			throw redirect(303, `/games/${game.id}`);
		}
	}
};
