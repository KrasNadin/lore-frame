import { SettingOutlined, SignatureOutlined } from '@ant-design/icons';
import { Menu, Flex, Typography, MenuProps, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const menuMap: Record<string, string> = {
	main: '/lore-frame/',
	location: '/lore-frame/locations',
	actors: '/lore-frame/actors',
};

const items: MenuItem[] = [
	{
		label: 'Новый кадр',
		key: 'main',
	},
	{
		label: 'Сцены',
		key: 'location',
	},
	{
		label: 'Актеры',
		key: 'actors',
	},
];

export default function Header() {
	const navigate = useNavigate();
	const location = useLocation();

	const [current, setCurrent] = useState('main');

	useEffect(() => {
		const matchedKey = Object.entries(menuMap).find(([, path]) => location.pathname === path)?.[0];
		if (matchedKey) setCurrent(matchedKey);
	}, [location.pathname]);

	const choosePage: MenuProps['onClick'] = (e) => {
		setCurrent(e.key);
		const path = menuMap[e.key];
		if (path) navigate(path);
	};

	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			<Flex justify='space-between' align='center'>
				<Flex justify='flex-start' gap={20} style={{ minWidth: '250px' }}>
					<SignatureOutlined className='mainIcon' />
					<Space.Compact direction='vertical' style={{ width: '100%' }}>
						<Title level={4} style={{ margin: 0 }}>
							LoreFrame – создай свой кадр!
						</Title>
						<Typography.Text style={{ fontSize: 13, color: '#999' }}>Свиток версии 1.0</Typography.Text>
					</Space.Compact>
				</Flex>
				<Flex style={{ flex: 1, justifyContent: 'flex-end', overflow: 'hidden', minWidth: 0, gap: '10px' }}>
					<Menu
						mode='horizontal'
						onClick={choosePage}
						selectedKeys={[current]}
						items={items}
						style={{
							justifyContent: 'flex-end',
							background: 'transparent',
							borderBottom: 'none',
							fontSize: 16,
							minWidth: 0,
							flexWrap: 'nowrap',
						}}
						theme='light'
					/>
					<SettingOutlined className='mainIcon' onClick={() => navigate('/lore-frame/settings')} />
				</Flex>
			</Flex>
		</Space>
	);
}
