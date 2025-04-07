import pb from '$lib/pocketbase';
import { redirect, type Actions } from '@sveltejs/kit';
import type * as Kit from '@sveltejs/kit';

interface Dart {
	x: number;
	y: number;
	bed: string;
	segment: number;
	score: number;
	bust?: boolean;
}

interface Visit {
	darts: Dart[];
}

interface Player {
	name: string;
	score: number;
	visits: Visit[];
	current?: boolean;
	number_of_darts: number;
	average: number;
	removing_dart?: boolean;
}

export interface Type {
	id: string;
	name: string;
	settings: {
		starts_on: number;
	};
}

export interface Game {
	type: Type;
	players: Player[];
}

type RouteParams = {
	id: string;
};

export type PageLoad = Kit.Load<RouteParams>;

export const load: PageLoad = async ({ params }) => {
	console.log(params.id);
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const game = await pb.collection('games').getOne(params.id, { expand: 'type,players' });
	console.log(game.expand?.type);

	let players = game.expand?.players.map((p: any) => ({ name: p.name, score: game.expand?.type.settings.starts_on, visits: [{ darts: [] }], number_of_darts: 0, average: 0 }));
	players[0].current = true;

	let output: Game = {
		type: game.expand?.type,
		players: players
	};
	console.log(output);

	return { user: pb.authStore.model, game: output, game_id: params.id };
};

export const actions: Actions = {};
