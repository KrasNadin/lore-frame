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
					<Divider orientation='left' orientationMargin='0'>
						Мастерская сцен
					</Divider>
					<Alert
						className='info-alert'
						message={
							<>
								<Flex align='center' gap={10}>
									<QuestionCircleOutlined className='cardIcon' />
									Тут ты можешь найти и изменить все существующие сцены или создать новую.
								</Flex>
							</>
						}
						description='Сцена - это место, где происходит дейсвтие.
					Чтобы создать сцену, представь место, где может происходить действие в вашей игре.
					Опиши его атмосферу, окружение и важные детали: это может быть мрачный лес,
					заброшенная деревня, ледяная пещера или оживлённый портовый город. Добавь то,
					что делает это место особенным — звуки, погоду или необычные элементы.
					Чем подробнее описание, тем точнее GPT сможет визуализировать сцену.'
						closable
					/>
					<LocationsList locations={locations} />
					<Divider orientation='left' orientationMargin='0'>
						Создай новую сцену
					</Divider>
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
