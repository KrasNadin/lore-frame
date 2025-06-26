import { Layout, ConfigProvider, theme, Grid } from 'antd';
import '../index.scss';
import { BrowserRouter, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { renderRoutes, routes } from './routes';

import Header from '@/components/layouts/header';

const { useBreakpoint } = Grid;

const { Header: AntdHeader, Content: AntdContend } = Layout;

export default function App() {
	const screens = useBreakpoint();
	const isMobile = !screens.md;
	return (
		<RecoilRoot>
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
					token: {
						colorPrimary: '#c9a85c',
						colorError: '#a23b3b',
						fontSize: isMobile ? 11 : 16,
					},
				}}>
				<Layout style={{ height: '100vh', backgroundColor: '#E9E9E9' }}>
					<BrowserRouter>
						<AntdHeader style={{ backgroundColor: '#E9E9E9', padding: isMobile ? '12px 16px' : '20px 40px' }}>
							<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
								<Header />
							</ConfigProvider>
						</AntdHeader>
						<AntdContend style={{ padding: isMobile ? '5px 16px' : '16px 48px', overflowY: 'auto' }}>
							<div style={{ margin: '10px', width: '100%' }}>
								<Routes>{renderRoutes(routes)}</Routes>
							</div>
						</AntdContend>
					</BrowserRouter>
				</Layout>
			</ConfigProvider>
		</RecoilRoot>
	);
}
