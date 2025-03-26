import pb from '$lib/pocketbase';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const settingsSchema = z.object({
	dartboard: z.string().nonempty('Dartboard UUID is required')
});

export const load: PageServerLoad = async () => {
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
	return { user: pb.authStore.model };
};

export const actions: Actions = {
	saveSettings: async ({ request }) => {
		const form = await superValidate(request, zod(settingsSchema));

		if (!form.valid) {
			return message(form, 'Invalid settings.');
		}

		try {
			if (pb.authStore.model) {
				await pb.collection('users').update(pb.authStore.model.id, { settings: form.data });
			}
		} catch (error) {
			return message(form, 'Invalid settings.');
		}
	}
};
