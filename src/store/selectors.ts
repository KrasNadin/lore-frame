import { selector } from 'recoil';

import { gptState } from './atoms.ts';

export const getApiKey = selector<string>({
	key: 'getApiKey',
	get: ({ get }) => get(gptState),
});
