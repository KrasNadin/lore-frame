import { atom, useRecoilState, useSetRecoilState } from 'recoil';

import { localStorageEffect } from './effects';
import { DefaultInfo } from './types';

export const randomId = (prefix: string = '') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// {GPT Chat keys}

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

// {Location}
export const locationsState = atom<DefaultInfo[]>({
	key: 'locations',
	default: [],
	effects: [localStorageEffect('locations')],
});

export const useLocationActions = () => {
	const [locations, setLocation] = useRecoilState(locationsState);

	const addLocation = ({ id, title, description }: DefaultInfo) => {
		setLocation((prevLocations) => [...prevLocations, { id, title, description }]);
	};

	const deleteLocation = (id: string) => {
		setLocation((prevLocations) => {
			return prevLocations.filter((location) => location.id !== id);
		});
	};

	const updateLocation = (id: string, description: string) => {
		const updatedLocation = locations.map((location) => {
			if (location.id === id) {
				return { ...location, description };
			}
			return location;
		});
		setLocation(updatedLocation);
	};

	return { addLocation, deleteLocation, updateLocation };
};
