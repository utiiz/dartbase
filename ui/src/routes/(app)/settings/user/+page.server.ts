import pb from '$lib/pocketbase';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { invalidateAll } from '$app/navigation';

const settingsSchema = z.object({
	email: z.string().email(),
	name: z.string().nonempty(),
});

export const load: PageServerLoad = async () => {
	if (!pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
	const form = await superValidate({
		email: pb.authStore.model?.email,
		name: pb.authStore.model?.name || ''
	}, zod(settingsSchema));

	return { form };
};

export const actions: Actions = {
	saveSettings: async ({ request }) => {
		const form = await superValidate(request, zod(settingsSchema));

		if (!form.valid) {
			return message(form, form.errors.name);
		}

		try {
			if (pb.authStore.model) {
				await pb.collection('users').update(pb.authStore.model.id, { name: form.data.name });
			}

			return message(form, 'Successfully updated settings.');
		} catch (error) {
			return message(form, 'Invalid settings.');
		}
	}
};
