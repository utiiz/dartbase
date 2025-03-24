import pb from '$lib/pocketbase';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../login/$types';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const signupSchema = z.object({
	email: z.string().nonempty('Email is required').email('Email is invalid'),
});

export const load: PageServerLoad = async () => {
	if (pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	const form = await superValidate(zod(signupSchema));

	return { form };
};

export const actions: Actions = {
	passwordReset: async ({ request }) => {
		const form = await superValidate(request, zod(signupSchema));

		if (!form.valid) {
			return message(form, 'Invalid email address.');
		}

		try {
			await pb.collection('users').requestPasswordReset(form.data.email);
			return message(form, 'Password reset email sent.');

		} catch (error) {
			return message(form, 'Invalid email address.');
		}
	}
};
