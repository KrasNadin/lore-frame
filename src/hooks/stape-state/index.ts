import { useState } from 'react';

import { DefaultInfo } from '@/store/types';

export const useStepState = () => {
	const [selectedLocationId, setSelectedLocationId] = useState<string>();
	const [locationDescription, setLocationDescription] = useState<string>('');
	const [selectedActorsId, setSelectedActorsId] = useState<string[]>([]);
	const [selectedActors, setSelectedActors] = useState<DefaultInfo[]>([]);
	const [action, setAction] = useState<string>('');
	const [isGenerating, setIsGenerating] = useState<boolean>(false);

	return {
		selectedLocationId,
		setSelectedLocationId,
		locationDescription,
		setLocationDescription,
		selectedActorsId,
		setSelectedActorsId,
		selectedActors,
		setSelectedActors,
		action,
		setAction,
		isGenerating,
		setIsGenerating,
	};
};
