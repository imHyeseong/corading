import { PUBLIC_BASE_URL, PUBLIC_WEB_PORT } from '$env/static/public';

const baseUrl = `${PUBLIC_BASE_URL}:${PUBLIC_WEB_PORT}`;

export const svelteFetch = {
	async get(url: string, query?: Record<string, string>) {
		let finalUrl = `${baseUrl}${url}`;

		if (query) {
			const params = new URLSearchParams(query);
			finalUrl += `?${params.toString()}`;
		}
		const response = await fetch(finalUrl);
		return await response.json();
	},

	async post(url: string, data?: any) {
		const response = await fetch(`${baseUrl}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	}
};
