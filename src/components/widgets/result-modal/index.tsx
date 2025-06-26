import { Button, Modal, notification } from 'antd';
import { useRecoilValue } from 'recoil';

import { imagesState, useImagesActions } from '@/store/atoms';

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
	const images = useRecoilValue(imagesState);
	const { addActors } = useImagesActions();

	const openNotification = (message: string) => {
		api.info({
			message: message,
			placement: 'bottomRight',
		});
	};

	const randomIndex = Math.floor(Math.random() * titleTemplates.length);

	const handleSaveImages = () => {
		addActors(imageUrl);
		if (images.includes(imageUrl)) {
			openNotification('Загляни в "Мои кадры", эта картинка уже есть там. Нечего просто так жать на кнопку!');
		} else {
			openNotification('Теперь ты можешь найти эту картинку в сохраненных кадрах!');
		}
	};

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
						<Button key='save' type='primary' style={{ width: 220 }} onClick={handleSaveImages}>
							Круто! Сохрани
						</Button>
						<Button key='copy' style={{ width: 220 }} onClick={handleCopyResult}>
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
