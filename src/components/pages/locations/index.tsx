import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Collapse, Divider, Flex, Alert } from 'antd';
import type { CollapseProps } from 'antd';
import { useState } from 'react';

type SceneItem = {
	key: string;
	title: string;
	content: string;
};

const initialScenes: SceneItem[] = [
	{
		key: '1',
		title: 'Темный лес',
		content: 'Туман, мрачная атмосфера, шорохи в кустах.',
	},
	{
		key: '2',
		title: 'Башня волшебника',
		content: 'Высокая башня, книги, светящиеся кристаллы.',
	},
	{
		key: '3',
		title: 'Подземелье Пламенного рыцаря',
		content: 'Лава, темные стены, эхо шагов.',
	},
];

export default function Locations() {
	const [editStates, setEditStates] = useState(
		initialScenes.reduce(
			(acc, item) => {
				acc[item.key] = { editing: false, value: item.content };
				return acc;
			},
			{} as Record<string, { editing: boolean; value: string }>
		)
	);

	const handleEditLocationToggle = (key: string) => {
		setEditStates((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: !prev[key].editing },
		}));
	};

	const handleChangeLocation = (key: string, newValue: string) => {
		setEditStates((prev) => ({
			...prev,
			[key]: { ...prev[key], value: newValue },
		}));
	};

	const handleSaveLocation = (key: string) => {
		handleEditLocationToggle(key);
		console.log(`Сохранено [${key}]:`, editStates[key].value);
	};

	const collapseItems: CollapseProps['items'] = initialScenes.map((scene) => ({
		key: scene.key,
		label: scene.title,
		children: (
			<Space.Compact style={{ width: '100%' }}>
				<Input
					value={editStates[scene.key].value}
					onChange={(e) => handleChangeLocation(scene.key, e.target.value)}
					disabled={!editStates[scene.key].editing}
				/>
				{editStates[scene.key].editing ? (
					<Button type='primary' onClick={() => handleSaveLocation(scene.key)}>
						Сохранить
					</Button>
				) : (
					<Button onClick={() => handleEditLocationToggle(scene.key)}>Изменить</Button>
				)}
				<Button type='primary' onClick={() => handleSaveLocation(scene.key)}>
					Удалить
				</Button>
			</Space.Compact>
		),
	}));

	const onChange = (key: string | string[]) => {
		console.log('Раскрыто:', key);
	};

	const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		console.log(e, 'I was closed.');
	};

	return (
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
					onClose={onClose}
				/>
				<Collapse onChange={onChange} items={collapseItems} />
				<Divider orientation='left' orientationMargin='0'>
					Создай новую сцену
				</Divider>
				<Space.Compact style={{ width: '100%' }}>
					<Input
						style={{ height: 48 }}
						// onPressEnter={handleSubmit}
						placeholder='Напиши короткое описание локации'
					/>
					<Button type='primary' style={{ height: 48 }}>
						Создать сцену
					</Button>
				</Space.Compact>
			</Space>
		</Card>
	);
}
