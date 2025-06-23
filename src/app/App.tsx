import { Layout, ConfigProvider, theme } from 'antd';
import '../index.scss';
import { BrowserRouter, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { renderRoutes, routes } from './routes';

import Header from '@/components/layouts/header';

const { Header: AntdHeader, Content: AntdContend } = Layout;

export default function App() {
	return (
		<RecoilRoot>
			<ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
				<Layout style={{ height: '100vh', backgroundColor: '#E9E9E9' }}>
					<BrowserRouter>
						<AntdHeader style={{ backgroundColor: '#E9E9E9', padding: '20px 40px' }}>
							<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
								<Header />
							</ConfigProvider>
						</AntdHeader>
						<AntdContend style={{ padding: '16px 48px', overflowY: 'auto' }}>
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
