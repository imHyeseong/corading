import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const kor = url.searchParams.get('kor') || 'upbit';
	const intl = url.searchParams.get('intl') || 'binance';

	console.log(kor, intl);
	return { kor, intl };
};
