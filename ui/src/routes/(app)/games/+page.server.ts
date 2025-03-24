import pb from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

};
