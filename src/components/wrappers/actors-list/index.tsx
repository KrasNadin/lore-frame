import { CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Space } from 'antd';
import { useRecoilValue } from 'recoil';

import { actorsState, useActorsActions } from '@/store/atoms';
import { DefaultInfo } from '@/store/types';

export default function ActorsList() {
	const actors = useRecoilValue(actorsState);
	const { deleteActors } = useActorsActions();

	const removeActor = (id: string) => {
		deleteActors(id);
	};

	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			{actors.length === 0 && <div>Пока ни одного актёра.</div>}
			{actors.map((actor: DefaultInfo) => (
				<Flex
					key={actor.id}
					justify='space-between'
					align='center'
					style={{
						padding: '8px 12px',
						background: 'black',
						borderRadius: 4,
					}}>
					<div>{actor.title}</div>
					<Button type='text' size='small' icon={<CloseOutlined />} onClick={() => removeActor(actor.id)} />
				</Flex>
			))}
		</Space>
	);
}
