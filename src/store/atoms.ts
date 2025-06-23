import { atom, useSetRecoilState } from 'recoil';

import { localStorageEffect } from './effects';

export const gptState = atom<string>({
	key: 'gptKey',
	default: '',
	effects: [localStorageEffect('gptKey')],
});

export const useGptActions = () => {
	const setKey = useSetRecoilState(gptState);

	const setGptKey = (apiKey: string) => {
		setKey(apiKey);
	};

	return { setGptKey };
};
