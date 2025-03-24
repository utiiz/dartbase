import pb from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../login/$types';

export const load: PageServerLoad = async () => {
	pb.authStore.clear();
	throw redirect(303, '/login');
};
