import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const theme = cookies.get('theme');
	if (theme) {
		cookies.set('theme', theme, { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}

	return {};
};

export const actions: Actions = {
	setTheme: async ({ url, cookies }) => {
		const theme = url.searchParams.get('theme');
		if (theme) {
			cookies.set('theme', theme, { path: '/' });
		}
	}
};
