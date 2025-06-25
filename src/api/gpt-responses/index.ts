import axios from 'axios';

import { DefaultInfo } from '@/store/types';

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_IMAGE_URL = 'https://api.openai.com/v1/images/generations';
const CONTENT_TYPE_JSON = 'application/json';

function getHeaders(apiKey: string) {
	return {
		'Content-Type': CONTENT_TYPE_JSON,
		Authorization: `Bearer ${apiKey}`,
	};
}

export async function checkApiKey(apiKey: string): Promise<boolean> {
	try {
		if (!apiKey) {
			console.warn('API-ключ не указан.');
			return false;
		}

		const response = await axios.post(
			OPENAI_CHAT_URL,
			{
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'user', content: 'ping' }],
			},
			{
				headers: getHeaders(apiKey),
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
			OPENAI_CHAT_URL,
			{
				model: 'gpt-4o',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: 'Опиши внешность персонажа для игры в ДНД. Укажи его расу, рост и телосложение, цвет кожи или шерсти, цвет и форму глаз, характерные черты лица (например, уши, рога, шрамы), одежду (цвет, стиль, детали), аксессуары и предметы в руках. Пиши кратко, в одном абзаце, строго описывая внешний вид, без эмоций, историй и оценок.',
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
				headers: getHeaders(apiKey),
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

export async function getImageGenerateResponse(apiKey: string, locationDescription: string, actors: DefaultInfo[], action: string) {
	try {
		const response = await axios.post(
			OPENAI_IMAGE_URL,
			{
				model: 'dall-e-3',
				prompt: `Make a storybook illustration in the style of early Russian folktales.
					Scene: ${locationDescription}, where ${action}.
					Characters: ${actors.map((a) => `${a.title} — ${a.description}`).join('; ')}.

					Strictly follow the visual details of each character as described — including clothing, hairstyle, accessories, body shape, and posture. Do not invent or add elements that are not mentioned. Each character must be clearly distinguishable and accurately represented.

					Use a limited, muted color palette, stylized but anatomically grounded figures, thick hand-inked outlines, and a clear, symmetrical composition. Keep the background simple and do not add unnecessary objects or scenery.

					Include decorative framing in the style of Russian storybooks: borders with mythological patterns, knotwork, and birds like crows or owls, where appropriate.

					Camera is positioned at a distance to show full-body characters and the environment with clarity. Printed book texture, flat watercolor-style fill, and visual harmony are important.
					If you feel like the described situation is inappropriate in any way feel free to change it in the way that will work out. The main focus should be keeping characters as they are described to be recognizable and the situation portrayed to be at least resembling what is described, but moderate divergence is allowed.`,
				n: 1,
				size: '1024x1024',
			},
			{
				headers: getHeaders(apiKey),
			}
		);
		const result = response.data;
		return result.data?.[0]?.url;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Ошибка при запросе к OpenAI:', error.response?.data || error.message);
		} else {
			console.error('Неизвестная ошибка:', error);
		}
		return null;
	}
}
