import { CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Space } from 'antd';
import { useState } from 'react';

type Actor = {
	key: string;
	name: string;
	description: string;
};

export default function ActorsList() {
	const [actors, setActors] = useState<Actor[]>([
		{
			key: '1',
			name: 'Рагнар',
			description: '...',
		},
		{
			key: '2',
			name: 'Поль де Голь',
			description: '...',
		},
	]);

	const removeActor = (key: string) => {
		setActors((prev) => prev.filter((actor) => actor.key !== key));
	};

	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			{actors.length === 0 && <div>Пока ни одного актёра.</div>}
			{actors.map((actor) => (
				<Flex
					key={actor.key}
					justify='space-between'
					align='center'
					style={{
						padding: '8px 12px',
						background: 'black',
						borderRadius: 4,
					}}>
					<div>{actor.name}</div>
					<Button type='text' size='small' icon={<CloseOutlined />} onClick={() => removeActor(actor.key)} />
				</Flex>
			))}
		</Space>
	);
}
