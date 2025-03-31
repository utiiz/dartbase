import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageServerLoad = async ({ cookies }) => {
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const theme = cookies.get('theme');
	if (theme) {
		cookies.set('theme', theme, { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}

	redirect(303, '/games');
};

export const actions: Actions = {
	setTheme: async ({ url, cookies }) => {
		const theme = url.searchParams.get('theme');
		if (theme) {
			cookies.set('theme', theme, { path: '/' });
		}
	}
};
