import pb from '$lib/pocketbase';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../login/$types';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const signupSchema = z.object({
	email: z.string().nonempty('Email is required').email('Email is invalid'),
	password: z.string().nonempty('Password is required'),
	passwordConfirm: z.string().nonempty('Password confirmation is required')
});

export const load: PageServerLoad = async () => {
	if (pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	const form = await superValidate(zod(signupSchema));

	return { form };
};

export const actions: Actions = {
	signup: async ({ request }) => {
		const form = await superValidate(request, zod(signupSchema));

		if (!form.valid) {
			return message(form, 'Invalid login credentials.');
		}

		try {
			await pb.collection('users').create(form.data);
			await pb.collection('users').authWithPassword(form.data.email, form.data.password);
			if (pb.authStore.isValid) {
				throw redirect(303, '/');
			}
		} catch (error) {
			return message(form, 'Invalid login credentials.');
		}
	}
};
