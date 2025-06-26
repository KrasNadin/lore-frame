import { DeleteOutlined } from '@ant-design/icons';
import { Card, Modal, Row, Col, Popconfirm } from 'antd';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { imagesState, useImagesActions } from '@/store/atoms';

export default function GeneratedImage() {
	const images = useRecoilValue(imagesState);
	const { deleteActors } = useImagesActions();

	const [previewImage, setPreviewImage] = useState<string | null>(null);

	const handleImageClick = (url: string) => {
		setPreviewImage(url);
	};

	const handleCloseModal = () => {
		setPreviewImage(null);
	};

	return (
		<>
			<Row gutter={[12, 12]}>
				{images.map((imageUrl) => (
					<Col key={imageUrl} xs={12} sm={8} md={6} lg={4} xl={3}>
						<Card
							style={{
								borderRadius: 8,
								overflow: 'hidden',
								position: 'relative',
								padding: 0,
							}}
							bodyStyle={{ padding: 0 }}
							hoverable
							cover={
								<img
									src={imageUrl}
									alt='Generated'
									onClick={() => handleImageClick(imageUrl)}
									style={{
										width: '100%',
										height: 150,
										objectFit: 'cover',
										cursor: 'pointer',
									}}
								/>
							}>
							<Popconfirm
								title='Удаляем это?'
								description='Это действие нельзя будет отменить. Никогда.'
								onConfirm={() => deleteActors(imageUrl)}
								okText='Да'
								cancelText='Отмена'>
								<DeleteOutlined
									style={{
										position: 'absolute',
										top: 8,
										right: 8,
										color: 'white',
										backgroundColor: 'rgba(0, 0, 0, 0.5)',
										borderRadius: '50%',
										padding: 4,
										cursor: 'pointer',
										fontSize: 16,
									}}
								/>
							</Popconfirm>
						</Card>
					</Col>
				))}
			</Row>

			<Modal open={Boolean(previewImage)} footer={null} onCancel={handleCloseModal} centered width='auto'>
				<img src={previewImage ?? ''} alt='Preview' style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
			</Modal>
		</>
	);
}
