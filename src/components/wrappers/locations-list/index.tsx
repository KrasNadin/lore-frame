import { Button, Input, Space, Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';

import { useLocationActions } from '@/store/atoms';
import { DefaultInfo } from '@/store/types';

type Props = {
	locations: DefaultInfo[];
};

export default function LocationsList({ locations }: Props) {
	const [editStates, setEditStates] = useState<Record<string, { editing: boolean; value: string }>>({});
	const { updateLocation, deleteLocation } = useLocationActions();

	useEffect(() => {
		setEditStates((prev) => {
			const updated = { ...prev };
			locations.forEach((loc) => {
				if (!updated[loc.id]) {
					updated[loc.id] = {
						editing: false,
						value: loc.description,
					};
				}
			});
			return updated;
		});
	}, [locations]);

	const handleEditToggle = (id: string) => {
		setEditStates((prev) => ({
			...prev,
			[id]: { ...prev[id], editing: !prev[id].editing },
		}));
	};

	const handleChange = (id: string, newValue: string) => {
		setEditStates((prev) => ({
			...prev,
			[id]: { ...prev[id], value: newValue },
		}));
	};

	const handleSave = (id: string) => {
		handleEditToggle(id);
		const newValue = editStates[id]?.value;
		if (!newValue) return;

		updateLocation(id, newValue);
		setEditStates((prev) => ({
			...prev,
			[id]: {
				...prev[id],
				editing: false,
			},
		}));
	};

	const handleDelete = (id: string) => {
		deleteLocation(id);
		setEditStates((prev) => {
			const updated = { ...prev };
			delete updated[id];
			return updated;
		});
	};

	const collapseItems: CollapseProps['items'] = locations.map((loc) => {
		const state = editStates[loc.id] || {
			editing: false,
			value: loc.description,
		};

		return {
			key: loc.id,
			label: loc.title,
			children: (
				<Space.Compact style={{ width: '100%' }}>
					<Input
						value={state.value}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(loc.id, e.target.value)}
						disabled={!state.editing}
					/>
					{state.editing ? (
						<Button type='primary' onClick={() => handleSave(loc.id)}>
							Сохранить
						</Button>
					) : (
						<Button onClick={() => handleEditToggle(loc.id)}>Изменить</Button>
					)}
					<Button danger onClick={() => handleDelete(loc.id)}>
						Удалить
					</Button>
				</Space.Compact>
			),
		};
	});

	return locations.length > 0 ? (
		<Collapse items={collapseItems} />
	) : (
		<p>Кажется, у тебя нет созданных сцен. Значит самое время создать новую!</p>
	);
}
