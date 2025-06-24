import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Space, Divider, Alert, Flex } from 'antd';

import MakeActor from '@/components/widgets/make-actor';
import ActorsList from '@/components/wrappers/actors-list';

export default function Actors() {
	return (
		<>
			<Card className='card' style={{ width: '100%' }}>
				<Space direction='vertical' size='middle' style={{ width: '100%' }}>
					<Divider orientation='left'>Мастерская актёров</Divider>

					<Flex className='actor-layout' gap='middle' wrap='wrap' align='stretch'>
						<MakeActor />
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
						/>
					</Flex>

					<Divider orientation='left'>Мои актеры</Divider>
					<ActorsList />
				</Space>
			</Card>
		</>
	);
}
