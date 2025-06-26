import { Button, Input, Space, Collapse, Popconfirm } from 'antd';
import type { CollapseProps } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { actorsState, useActorsActions } from '@/store/atoms';

export default function ActorsList() {
	const actors = useRecoilValue(actorsState);
	const { deleteActors, updateActor } = useActorsActions();
	const [editStates, setEditStates] = useState<Record<string, { editing: boolean; value: string }>>({});

	useEffect(() => {
		setEditStates((prev) => {
			const updated = { ...prev };
			actors.forEach((actor) => {
				if (!updated[actor.id]) {
					updated[actor.id] = {
						editing: false,
						value: actor.description,
					};
				}
			});
			return updated;
		});
	}, [actors]);

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

		updateActor(id, newValue);
		setEditStates((prev) => ({
			...prev,
			[id]: {
				...prev[id],
				editing: false,
			},
		}));
	};

	const handleDelete = (id: string) => {
		deleteActors(id);
		setEditStates((prev) => {
			const updated = { ...prev };
			delete updated[id];
			return updated;
		});
	};

	const collapseItems: CollapseProps['items'] = actors.map((actor) => {
		const state = editStates[actor.id] || {
			editing: false,
			value: actor.description,
		};

		return {
			key: actor.id,
			label: actor.title,
			children: (
				<Space.Compact style={{ width: '100%' }}>
					<Input.TextArea
						value={state.value}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange(actor.id, e.target.value)}
						disabled={!state.editing}
					/>
					<Space.Compact direction='vertical'>
						{state.editing ? (
							<Button type='primary' onClick={() => handleSave(actor.id)}>
								Сохранить
							</Button>
						) : (
							<Button onClick={() => handleEditToggle(actor.id)}>Изменить</Button>
						)}
						<Popconfirm
							title='Удаляем это?'
							description='Это действие нельзя будет отменить. Никогда.'
							onConfirm={() => handleDelete(actor.id)}
							okText='Да'
							cancelText='Отмена'>
							<Button danger>Удалить</Button>
						</Popconfirm>
					</Space.Compact>
				</Space.Compact>
			),
		};
	});

	return actors.length > 0 ? (
		<>
			<Collapse items={collapseItems} />
		</>
	) : (
		<p>Кажется, у тебя нет актеров. Значит самое время создать новых!</p>
	);
}
