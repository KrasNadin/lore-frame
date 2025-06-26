import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Space, Upload, Input, Button, notification, Modal } from 'antd';
import type { UploadProps, GetProp } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ChangeEvent, useState } from 'react';
import { useRecoilState } from 'recoil';

import { getMakeActorResponse } from '@/api/gpt-responses';
import { gptState, randomId, useActorsActions } from '@/store/atoms';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType, callback: (url: string) => void) => {
	const reader = new FileReader();
	reader.onload = () => callback(reader.result as string);
	reader.readAsDataURL(file);
};

export default function MakeActor() {
	const [apiKey] = useRecoilState(gptState);
	const { addActors } = useActorsActions();
	const [loading, setLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState<string>();
	const [title, setTitle] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [isGenerating, setIsGenerating] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [api, contextHolder] = notification.useNotification();

	const openNotification = (message: string) => {
		api.info({
			message: message,
			placement: 'bottomRight',
		});
	};

	const validateImage = (file: FileType) => {
		const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isImage) {
			openNotification('Можно загружать только JPG/PNG!');
		}

		const isSmall = file.size / 1024 / 1024 < 2;
		if (!isSmall) {
			openNotification('Изображение должно быть меньше 2MB!');
		}

		return isImage && isSmall;
	};

	const uploadButton = (
		<button style={{ border: 0, background: 'none', color: '#d9d9d9' }} type='button'>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8, color: '#d9d9d9', fontFamily: 'Luminari' }}>{loading ? 'Загрузка' : 'Загрузить портрет'}</div>
		</button>
	);

	const handleAddActor = async (apiKey: string, previewImage: string) => {
		if (!title) return;
		if (!apiKey) {
			openNotification('Что-то не так. Проверьте подключение к GPT в настройках приложения.');
		}
		setIsGenerating(true);
		const result: string | null = await getMakeActorResponse(apiKey, previewImage);
		setIsGenerating(false);
		if (!result) {
			openNotification('GPT не смог описать персонажа. Попробуйте другое изображение.');
			setIsGenerating(false);
			return;
		}
		setDescription(result);
		setIsModalOpen(true);
	};

	const handleSaveActor = () => {
		const id = randomId();
		addActors({ id, title: title!, description: description! });
		setIsModalOpen(false);
		setTitle('');
		setPreviewImage(undefined);
		setDescription('');
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			{contextHolder}
			<Modal
				title='Вот что у нас получилось:'
				open={isModalOpen}
				onOk={handleSaveActor}
				onCancel={handleCancel}
				okText='Сохранить'
				cancelText='Отмена'
				maskClosable={false}>
				<TextArea
					value={description}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
					style={{ minHeight: '200px' }}
				/>
			</Modal>
			<Card>
				<Space direction='horizontal' size='middle' className='actor-layout'>
					<Upload
						name='new-actor'
						listType='picture-card'
						className='actor-uploader'
						showUploadList={false}
						beforeUpload={(file) => {
							const isValid = validateImage(file);
							if (!isValid) return false;

							setLoading(true);
							getBase64(file, (url) => {
								setPreviewImage(url);
								setLoading(false);
								openNotification('Изображение загружено!');
							});

							return false;
						}}>
						{previewImage ? (
							<img src={previewImage} alt='actor' style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
						) : (
							uploadButton
						)}
					</Upload>
					<Space direction='vertical' size='middle'>
						<Input
							style={{ width: '100%' }}
							placeholder='Имя актёра'
							value={title}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
							disabled={isGenerating}
						/>
						<Button
							type='primary'
							style={{ width: '100%' }}
							onClick={() => handleAddActor(apiKey, previewImage!)}
							disabled={title?.length === 0}>
							{isGenerating ? 'Создаем...' : 'Создать актёра'}
						</Button>
					</Space>
				</Space>
			</Card>
		</>
	);
}
