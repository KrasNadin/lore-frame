import { Button, Modal, notification } from 'antd';

type Props = {
	isModalOpen: boolean;
	setIsModalOpen: (arg: boolean) => void;
	handleImageGenerate: () => void;
	imageUrl: string;
};

const titleTemplates = [
	'Лист из Великой Хроники',
	'Иллюстрация из Песенного Свитка',
	'Гравюра из Путевых Записей',
	'Лист из манускрипта Бродячего Барда',
	'Иллюстрация, найденная в старом гербарии',
	'Миниатюра из монастырской библиотеки',
	'Запечатлённое пером и тушью странствующего летописца',
	'Старинная страница из иллюстрированной баллады',
];

export default function ResultModal({ isModalOpen, setIsModalOpen, handleImageGenerate, imageUrl }: Props) {
	const [api, contextHolder] = notification.useNotification();

	const openNotification = (message: string) => {
		api.info({
			message: message,
			placement: 'bottomRight',
		});
	};

	const randomIndex = Math.floor(Math.random() * titleTemplates.length);

	const handleCopyResult = async () => {
		try {
			await navigator.clipboard.writeText(imageUrl);
			openNotification('Ссылка на изображение скопирована в буфер обмена!');
		} catch (err) {
			console.error(err);
			openNotification('Что-то пошло не так. Не получилось скопировать ссылку.');
		}
	};

	return (
		<>
			{contextHolder}
			<Modal
				title={titleTemplates[randomIndex]}
				open={isModalOpen}
				onCancel={() => {
					setIsModalOpen(false);
				}}
				footer={
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 12,
						}}>
						<Button key='copy' type='primary' style={{ width: 220 }} onClick={handleCopyResult}>
							Копировать ссылку
						</Button>
						<Button key='retry' type='default' danger style={{ width: 220 }} onClick={handleImageGenerate}>
							Все фигня, переделывай
						</Button>
					</div>
				}
				maskClosable={false}>
				<img src={imageUrl} alt='Generated' style={{ width: '100%', borderRadius: 8 }} />
			</Modal>
		</>
	);
}
