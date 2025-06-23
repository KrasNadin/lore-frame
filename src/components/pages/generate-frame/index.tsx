import { Button, Card, Col, Input, Row, Select, Space, Steps } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GenerateFrame() {
	const navigate = useNavigate();

	const [current, setCurrent] = useState(0);

	const onChange = (value: number) => {
		console.log('onChange:', value);
		setCurrent(value);
	};

	return (
		<>
			<Row justify='center' gutter={[0, 24]} style={{ width: 'auto' }}>
				<Col span={24}>
					<Card className='card' title='Режиссерская панель'>
						<Steps
							direction='vertical'
							current={current}
							style={{ maxWidth: '500px' }}
							onChange={onChange}
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
												<Input />
												<Button type='primary'>Проверить</Button>
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
												filterSort={(optionA, optionB) =>
													(optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
												}
												options={[
													{
														value: '1',
														label: 'Темный лес',
													},
													{
														value: '1',
														label: 'Лагерь разбойников',
													},
												]}
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
												options={[
													{
														value: '1',
														label: 'Гарри Смит',
													},
													{
														value: '1',
														label: 'Пол Уокер',
													},
												]}
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
