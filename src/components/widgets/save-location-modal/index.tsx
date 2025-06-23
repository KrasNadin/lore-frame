import { Input, Modal } from 'antd';
import { useState } from 'react';

import { randomId, useLocationActions } from '@/store/atoms';

type Props = {
	description: string;
	isModalOpen: boolean;
	setIsModalOpen: (arg: boolean) => void;
	setDescription: (arg: string) => void;
};

export default function SaveLocationModal({ description, isModalOpen, setIsModalOpen, setDescription }: Props) {
	const [title, setTitle] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const { addLocation } = useLocationActions();

	const handleSaveLocation = () => {
		if (title.trim().length === 0) return;
		setIsSaving(true);
		const id = randomId();
		addLocation({ id, title: title, description });
		setIsModalOpen(false);
		setIsSaving(false);
		setDescription('');
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<Modal
			title={isSaving ? 'Сохраняем...' : 'Создание локации'}
			open={isModalOpen}
			onOk={handleSaveLocation}
			onCancel={handleCancel}
			okText='Сохранить'
			cancelText='Отмена'
			okButtonProps={{
				disabled: title.length === 0,
				loading: isSaving,
			}}
			cancelButtonProps={{
				disabled: isSaving,
			}}
			maskClosable={false}>
			<p style={{ marginTop: 20 }}>Твоя сцена: {description}</p>
			<Input
				placeholder='Придумай название для сцены'
				value={title}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
				disabled={isSaving}
			/>
		</Modal>
	);
}
