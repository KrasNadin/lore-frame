import axios from 'axios';

const apiUrl = 'https://api.openai.com/v1/chat/completions';

export async function checkApiKey(apiKey: string): Promise<boolean> {
	try {
		if (!apiKey) {
			console.warn('API-ключ не указан.');
			return false;
		}

		const response = await axios.post(
			apiUrl,
			{
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: 'ping' }],
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
			}
		);

		return response.status === 200;
	} catch (error: any) {
		if (axios.isAxiosError(error) && error.response && (error.response.status === 401 || error.response.status === 403)) {
			console.warn('API-ключ недействителен или запрещен.');
			return false;
		}
		return false;
	}
}

export async function getMakeActorResponse(apiKey: string, base64Image: string) {
	try {
		const response = await axios.post(
			apiUrl,
			{
				model: 'gpt-4o',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'На изображении — вымышленный герой из фэнтези-вселенной. Опиши его внешность как для художника на русском языке: раса (например, эльф, орк, дроу, демон и т.п.), телосложение и рост, оттенок кожи (например, бледная, бронзовая, серая), глаза (форма, цвет, особенности), волосы (длина, цвет, стиль), особенности лица (шрамы, татуировки, маски, рога и т.п.), одежда (стиль, цвет, материал), оружие или артефакт в руках, общая атмосфера персонажа (таинственный, свирепый, благородный, дикарь и т.д.). Помни, что это герой ролевой игры. Опиши только визуальные детали.',
							},
							{
								type: 'image_url',
								image_url: {
									url: base64Image,
								},
							},
						],
					},
				],
				max_tokens: 600,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
			}
		);
		return response.data.choices[0].message.content;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			console.error('Ошибка при запросе к OpenAI:', error.response?.data || error.message);
		} else {
			console.error('Неизвестная ошибка:', error);
		}
		return null;
	}
}
