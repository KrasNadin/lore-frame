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

// {Actors}
export const actorsState = atom<DefaultInfo[]>({
	key: 'actors',
	default: [],
	effects: [localStorageEffect('actors')],
});

export const useActorsActions = () => {
	const [actors, setActors] = useRecoilState(actorsState);

	const addActors = ({ id, title, description }: DefaultInfo) => {
		setActors((prevActors) => [...prevActors, { id, title, description }]);
	};

	const deleteActors = (id: string) => {
		setActors((prevActors) => {
			return prevActors.filter((actor) => actor.id !== id);
		});
	};

	const updateActor = (id: string, description: string) => {
		const updatedActor = actors.map((actor) => {
			if (actor.id === id) {
				return { ...actor, description };
			}
			return actor;
		});
		setActors(updatedActor);
	};

	return { addActors, deleteActors, updateActor };
};

// {Imaages}

export const imagesState = atom<string[]>({
	key: 'images',
	default: [],
	effects: [localStorageEffect('images')],
});

export const useImagesActions = () => {
	const setImages = useSetRecoilState(imagesState);

	const addActors = (imageUrl: string) => {
		setImages((prevImages) => {
			if (prevImages.includes(imageUrl)) return prevImages;
			return [...prevImages, imageUrl];
		});
	};

	const deleteActors = (imageUrl: string) => {
		setImages((prevActors) => {
			return prevActors.filter((image) => image !== imageUrl);
		});
	};

	return { addActors, deleteActors };
};
