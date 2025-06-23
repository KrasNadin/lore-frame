import { FC } from 'react';
import { Route } from 'react-router-dom';

import Actors from '@/components/pages/actors';
import GenerateFrame from '@/components/pages/generate-frame';
import Locations from '@/components/pages/locations';
import Settings from '@/components/pages/settings';

type RouteWithSubRoutesType<T = unknown> = {
	path: string;
	title: string;
	component: FC<T & { routes?: RouteWithSubRoutesType[] }>;
	routes?: RouteWithSubRoutesType[];
	children?: RouteWithSubRoutesType[];
};

export const routes: RouteWithSubRoutesType[] = [
	{
		path: '/lore-frame/',
		title: 'Создай свой кадр!',
		component: GenerateFrame,
	},
	{
		path: '/lore-frame/locations',
		title: 'Мои сцены',
		component: Locations,
	},
	{
		path: '/lore-frame/actors',
		title: 'Мои актеры',
		component: Actors,
	},
	{
		path: '/lore-frame/settings',
		title: 'Настройки',
		component: Settings,
	},
];

export const renderRoutes = (routes: RouteWithSubRoutesType[]) => {
	return (
		<>
			{routes.map((route, i) => (
				<Route key={i} path={route.path} element={<route.component routes={route.routes} />}>
					{route.children && renderRoutes(route.children)}
				</Route>
			))}
		</>
	);
};
