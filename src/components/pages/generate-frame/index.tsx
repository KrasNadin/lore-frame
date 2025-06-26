import { CloseOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Input, notification, Row, Select, Space, Steps } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { checkApiKey, getImageGenerateResponse } from '@/api/gpt-responses';
import { renderCheckStatus } from '@/components/widgets/check-status';
import ResultModal from '@/components/widgets/result-modal';
import { VoiceInput } from '@/components/widgets/voice-input';
import { useStepState } from '@/hooks/stape-state';
import { actorsState, gptState, locationsState, useGptActions } from '@/store/atoms';
import { DefaultInfo } from '@/store/types';

export default function GenerateFrame() {
	const navigate = useNavigate();
	const [gptKey] = useRecoilState(gptState);
	const { setGptKey } = useGptActions();
	const locations = useRecoilValue(locationsState);
	const actors = useRecoilValue(actorsState);

	const [current, setCurrent] = useState(0);
	const [userGptKey, setUserGptKey] = useState(gptKey);
	const [checkStatus, setCheckStatus] = useState<string>('waiting');
	const [isModalOpen, setModalOpen] = useState(false);
	const [api, contextHolder] = notification.useNotification();
	const [imageUrl, setImageUrl] = useState<string>('');

	const openNotification = (message: string) => {
		api.info({
			message: message,
			placement: 'bottomRight',
		});
	};

	const {
		selectedLocationId,
		setSelectedLocationId,
		locationDescription,
		setLocationDescription,
		setSelectedActorsId,
		selectedActors,
		setSelectedActors,
		action,
		setAction,
		isGenerating,
		setIsGenerating,
	} = useStepState();

	const handleCheckGptKey = useCallback(
		async (key: string) => {
			setCheckStatus('checking');
			const isChecked = await checkApiKey(key);
			if (isChecked) {
				setGptKey(key);
				setCheckStatus('success');
			} else {
				setCheckStatus('error');
				console.warn('Invalid API key. Update cancelled.');
			}
		},
		[setGptKey]
	);

	const handleSelectLocation = (value: string) => {
		setSelectedLocationId(value);
		const selectedLocationDescription = locations.find((loc) => loc.id === value)?.description;
		if (selectedLocationDescription) {
			setLocationDescription(selectedLocationDescription);
		}
	};

	const handleSelectActors = (value: string[]) => {
		setSelectedActorsId(value);
		const selectedActorsList = actors.filter((actor) => value.includes(actor.id)).filter(Boolean);
		setSelectedActors(selectedActorsList);
	};

	const handleImageGenerate = async () => {
		setModalOpen(false);
		setIsGenerating(true);
		const generatedImage: string = await getImageGenerateResponse(gptKey, locationDescription, selectedActors, action);
		console.log('Результат генерации:', generatedImage);
		setImageUrl(generatedImage);
		if (generatedImage.length === 0) {
			openNotification('DALL·E отказалась рисовать это. Наверное, слишком дерзко. Перепиши мягче. ');
		}
		setModalOpen(true);
		setIsGenerating(false);
	};

	const addVoiceText = (transcript: string) => {
		setAction((prev) => prev + transcript);
	};

	return (
		<>
			{contextHolder}
			{isModalOpen && (
				<ResultModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setModalOpen}
					handleImageGenerate={handleImageGenerate}
					imageUrl={imageUrl}
				/>
			)}
			<Row justify='center' gutter={[0, 24]} style={{ width: 'auto' }}>
				<Col span={24}>
					<Card className='card' title='Режиссерская панель'>
						<Steps
							direction='vertical'
							progressDot
							current={current}
							style={{ maxWidth: '500px' }}
							onChange={(value: number) => setCurrent(value)}
							items={[
								{
									title: 'Проверь свое подключение к Chat GPT',
									description: (
										<>
											<p>
												Перейди в свой{' '}
												<a
													href='https://chat.openai.com/'
													target='_blank'
													rel='noopener noreferrer'
													style={{ color: '#c9a85c', cursor: 'pointer' }}>
													аккаунт ChatGPT
												</a>{' '}
												и скопируй API ключ.
											</p>
											<Space.Compact style={{ width: '100%' }}>
												<Input value={userGptKey} onChange={(e) => setUserGptKey(e.target.value)} disabled={isGenerating} />
												<Button type='primary' onClick={() => handleCheckGptKey(userGptKey)} disabled={userGptKey.length === 0}>
													Проверить
												</Button>
												<div className='check-state'>{renderCheckStatus(checkStatus)}</div>
											</Space.Compact>
										</>
									),
								},
								{
									title: 'Выбери сцену или создай новую',
									description: (
										<>
											<Select
												showSearch
												style={{ width: '100%' }}
												optionFilterProp='label'
												value={selectedLocationId}
												onChange={handleSelectLocation}
												disabled={isGenerating}
												options={locations.map((loc: DefaultInfo) => ({
													label: loc.title,
													value: loc.id,
												}))}
											/>
											<p>
												Не нашел нужную сцену?{' '}
												<span onClick={() => navigate('/lore-frame/locations')} style={{ color: '#c9a85c', cursor: 'pointer' }}>
													Создай новую!
												</span>
											</p>
										</>
									),
								},
								{
									title: 'Выбери актеров или создай новых',
									description: (
										<>
											<Select
												showSearch
												mode='tags'
												style={{ width: '100%' }}
												tokenSeparators={[',']}
												onChange={handleSelectActors}
												disabled={isGenerating}
												options={actors.map((actor: DefaultInfo) => ({
													label: actor.title,
													value: actor.id,
												}))}
											/>
											<p>
												Ты можешь добавить новых актеров{' '}
												<span onClick={() => navigate('/lore-frame/actors')} style={{ color: '#c9a85c', cursor: 'pointer' }}>
													здесь
												</span>
											</p>
										</>
									),
								},
							]}
						/>
					</Card>
				</Col>
				<Col span={24}>
					<Card className='card'>
						<Space direction='vertical' size='middle'>
							<Alert
								className='info-alert'
								description='Важно! Мы генерируем изображение через DALL-E, а значит тут действуют все ограничения этой нейросети. Поэтому насилие, обнаженку и другую жесть мы сгенерировать не можем. Пока что.'
								closable
							/>
							<Space.Compact style={{ width: '100%' }}>
								<Input
									style={{ height: 48 }}
									placeholder='Напиши короткое описание действий актеров, упоминая их по именам'
									value={action}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAction(e.target.value)}
									disabled={isGenerating}
									suffix={
										<>
											<CloseOutlined
												onClick={() => {
													setAction('');
												}}
											/>
											<VoiceInput addVoiceText={addVoiceText} iconSize={24} />
										</>
									}
								/>
								<Button type='primary' style={{ height: 48 }} disabled={isGenerating} onClick={handleImageGenerate}>
									{isGenerating ? 'Подождите...' : 'Создать'}
								</Button>
							</Space.Compact>
						</Space>
					</Card>
				</Col>
			</Row>
		</>
	);
}
