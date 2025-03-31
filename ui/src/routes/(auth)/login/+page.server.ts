import pb from '$lib/pocketbase';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../login/$types';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const loginSchema = z.object({
	email: z.string().nonempty('Email is required').email('Email is invalid'),
	password: z.string().nonempty('Password is required')
});

export const load: PageServerLoad = async () => {
	if (pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	const form = await superValidate(zod(loginSchema));

	return { form };
};

export const actions: Actions = {
	login: async ({ request }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return message(form, 'Invalid login credentials.');
		}

		try {
			await pb.collection('users').authWithPassword(form.data.email, form.data.password);
		} catch (error) {
			// failure
			return message(form, 'Invalid login credentials.', { status: 401 });
		}
		if (pb.authStore.isValid) {
			throw redirect(303, '/');
		}
	}
};
