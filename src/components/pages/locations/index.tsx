import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Divider, Flex, Alert } from 'antd';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import SaveLocationModal from '@/components/widgets/save-location-modal';
import { VoiceInput } from '@/components/widgets/voice-input';
import LocationsList from '@/components/wrappers/locations-list';
import { locationsState } from '@/store/atoms';

export default function Locations() {
	const locations = useRecoilValue(locationsState);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [description, setDescription] = useState('');

	const addVoiceText = (transcript: string) => {
		setDescription(description + transcript);
	};

	return (
		<>
			{isModalOpen && (
				<SaveLocationModal
					description={description}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					setDescription={setDescription}
				/>
			)}
			<Card className='card' style={{ width: '100%' }}>
				<Space direction='vertical' size='middle' style={{ width: '100%' }}>
					<Divider orientation='left'>Мастерская сцен</Divider>
					<Alert
						className='info-alert'
						message={
							<>
								<Flex align='center' gap={10}>
									<QuestionCircleOutlined className='cardIcon' />
									Здесь ты можешь просматривать, редактировать и создавать сцены.
								</Flex>
							</>
						}
						description='Сцена — это место действия: таверна, руины, лес или город.
									Опиши его атмосферу, окружение и особые детали — это поможет магии визуализации.
									Чем подробнее описание, тем точнее GPT сможет визуализировать сцену.'
						closable
					/>
					<LocationsList locations={locations} />
					<Divider orientation='left'>Создай новую сцену</Divider>
					<Space.Compact style={{ width: '100%' }}>
						<Input
							style={{ height: 48 }}
							placeholder='Напиши короткое описание локации'
							value={description}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
							suffix={
								<>
									<CloseOutlined
										onClick={() => {
											setDescription('');
										}}
									/>
									<VoiceInput addVoiceText={addVoiceText} iconSize={24} />
								</>
							}
						/>
						<Button type='primary' style={{ height: 48 }} onClick={() => setIsModalOpen(true)} disabled={description === ''}>
							Создать сцену
						</Button>
					</Space.Compact>
				</Space>
			</Card>
		</>
	);
}
