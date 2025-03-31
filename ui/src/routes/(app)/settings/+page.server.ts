import pb from '$lib/pocketbase';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const settingsSchema = z.object({
	dartboard: z.string().uuid(),
	rate_limiting: z.boolean()
});

export const load: PageServerLoad = async () => {
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
	const form = await superValidate({
		dartboard: pb.authStore.model?.settings?.dartboard || '',
		rate_limiting: pb.authStore.model?.settings?.rate_limiting
	}, zod(settingsSchema));

	return { form };
};

export const actions: Actions = {
	saveSettings: async ({ request }) => {
		const form = await superValidate(request, zod(settingsSchema));

		if (!form.valid) {
			return message(form, form.errors.dartboard);
		}

		try {
			if (pb.authStore.model) {
				await pb.collection('users').update(pb.authStore.model.id, { settings: form.data });
			}

			return message(form, 'Successfully updated settings.');
		} catch (error) {
			return message(form, 'Invalid settings.');
		}
	}
};
