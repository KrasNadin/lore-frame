import { Button, Card, Col, Input, Row, Select, Space, Steps } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { checkApiKey } from '@/api/gpt-responses';
import { renderCheckStatus } from '@/components/widgets/check-status';
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

	const handleSetUserGptKey = (userGptKey: string) => {
		setUserGptKey(userGptKey);
	};

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

	return (
		<>
			<Row justify='center' gutter={[0, 24]} style={{ width: 'auto' }}>
				<Col span={24}>
					<Card className='card' title='Режиссерская панель'>
						<Steps
							direction='vertical'
							current={current}
							style={{ maxWidth: '500px' }}
							onChange={(value: number) => {
								setCurrent(value);
							}}
							items={[
								{
									title: 'Проверь свое подключение к Chat GPT',
									description: (
										<>
											<p>
												Перейди в свой{' '}
												<a href='https://chat.openai.com/' target='_blank' rel='noopener noreferrer'>
													аккаунт ChatGPT
												</a>{' '}
												и скопируй API ключ.
											</p>
											<Space.Compact style={{ width: '100%' }}>
												<Input
													value={userGptKey}
													onChange={(e) => {
														handleSetUserGptKey(e.target.value);
													}}
												/>
												<Button
													type='primary'
													onClick={() => {
														handleCheckGptKey(userGptKey);
													}}
													disabled={userGptKey.length === 0}>
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
												options={locations.map((loc: DefaultInfo) => ({
													label: loc.title,
													value: loc.id,
												}))}
											/>
											<p>
												Не нашел нужную сцену?&nbsp;
												<span onClick={() => navigate('/lore-frame/locations')} style={{ color: '#1677ff', cursor: 'pointer' }}>
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
												options={actors.map((actor: DefaultInfo) => ({
													key: actor.id,
													value: actor.title,
												}))}
											/>
											<p>
												Ты можешь добавить новых актеров&nbsp;
												<span onClick={() => navigate('/lore-frame/actors')} style={{ color: '#1677ff', cursor: 'pointer' }}>
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
						<Space.Compact style={{ width: '100%' }}>
							<Input
								style={{ height: 48 }}
								// onPressEnter={handleSubmit}
								placeholder='Напиши короткое описание действий актеров, упоминая их по именам'
							/>
							<Button type='primary' style={{ height: 48 }}>
								Создать
							</Button>
						</Space.Compact>
					</Card>
				</Col>
			</Row>
		</>
	);
}
