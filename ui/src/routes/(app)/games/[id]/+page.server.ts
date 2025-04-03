import pb from '$lib/pocketbase';
import { redirect, type Actions } from '@sveltejs/kit';
import type * as Kit from '@sveltejs/kit';

interface Dart {
	x: number;
	y: number;
	bed: string;
	segment: number;
	score: number;
}

interface Visit {
	darts: Dart[];
}

export interface Game {
	visits: Visit[];
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

	let game: Game = {
		visits: [
			{
				darts: [
					// {
					// 	x: 0,
					// 	y: 0,
					// 	bed: 'D',
					// 	segment: 13,
					// 	score: 26
					// },
					// {
					// 	x: 0,
					// 	y: 0,
					// 	bed: 'S',
					// 	segment: 5,
					// 	score: 5
					// },
					// {
					// 	x: 0,
					// 	y: 0,
					// 	bed: 'MISS',
					// 	segment: 0,
					// 	score: 0
					// }
				]
			}
			// {
			// 	darts: [
			// 		{
			// 			x: 0,
			// 			y: 0,
			// 			bed: 'T',
			// 			segment: 14,
			// 			score: 42
			// 		},
			// 		{
			// 			x: 0,
			// 			y: 0,
			// 			bed: 'S',
			// 			segment: 18,
			// 			score: 18
			// 		},
			// 		{
			// 			x: 0,
			// 			y: 0,
			// 			bed: 'S',
			// 			segment: 18,
			// 			score: 18
			// 		},
			// 		{
			// 			x: 0,
			// 			y: 0,
			// 			bed: 'S',
			// 			segment: 18,
			// 			score: 18
			// 		}
			// 	]
			// }
		]
	};

	return { user: pb.authStore.model, game, game_id: params.id };
};

export const actions: Actions = {};
