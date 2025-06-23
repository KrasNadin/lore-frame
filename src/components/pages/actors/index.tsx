import { LoadingOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Space, Divider, Upload, Input, Button, Alert, Flex, message } from 'antd';
import type { UploadProps, GetProp } from 'antd';
import { useState } from 'react';

import ActorsList from '@/components/wrappers/actors-list';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType, callback: (url: string) => void) => {
	const reader = new FileReader();
	reader.onload = () => callback(reader.result as string);
	reader.readAsDataURL(file);
};

const validateImage = (file: FileType) => {
	const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isImage) {
		message.error('Можно загружать только JPG/PNG!');
	}

	const isSmall = file.size / 1024 / 1024 < 2;
	if (!isSmall) {
		message.error('Изображение должно быть меньше 2MB!');
	}

	return isImage && isSmall;
};

export default function Actors() {
	const [loading, setLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState<string>();

	const handleImageChange: UploadProps['onChange'] = (info) => {
		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}
		if (info.file.status === 'done') {
			getBase64(info.file.originFileObj as FileType, (url) => {
				setLoading(false);
				setPreviewImage(url);
			});
		}
	};

	const uploadButton = (
		<button style={{ border: 0, background: 'none', color: '#d9d9d9' }} type='button'>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8, color: '#d9d9d9' }}>{loading ? 'Загрузка' : 'Загрузить портрет'}</div>
		</button>
	);

	return (
		<Card className='card' style={{ width: '100%' }}>
			<Space direction='vertical' size='middle' style={{ width: '100%' }}>
				<Divider orientation='left'>Мастерская актёров</Divider>

				<Flex className='actor-layout' gap='middle' wrap='wrap' align='stretch'>
					<Card>
						<Space direction='horizontal' size='middle' className='actor-layout'>
							<Upload
								name='new-actor'
								listType='picture-card'
								className='actor-uploader'
								showUploadList={false}
								action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
								beforeUpload={validateImage}
								onChange={handleImageChange}>
								{previewImage ? <img src={previewImage} alt='actor' style={{ width: '100%' }} /> : uploadButton}
							</Upload>

							<Space direction='vertical' size='middle'>
								<Input style={{ width: '100%' }} placeholder='Имя актёра' />
								<Button type='primary' style={{ width: '100%' }}>
									Создать актёра
								</Button>
							</Space>
						</Space>
					</Card>

					<Alert
						className='info-alert'
						message={
							<Flex align='center' gap={10}>
								<QuestionCircleOutlined className='cardIcon' />
								Кто такие актёры?
							</Flex>
						}
						description='Актёры — это персонажи игроков, союзники, враги и все те, кто имеет имя и внешний вид. Загрузите изображение, дайте имя — и используйте их в игре.'
						closable
						onClose={() => console.log('Инфо закрыто')}
					/>
				</Flex>

				<Divider orientation='left'>Мои актеры</Divider>
				<ActorsList />
			</Space>
		</Card>
	);
}
