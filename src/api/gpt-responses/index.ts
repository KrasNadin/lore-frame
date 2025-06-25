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
		const promptGenerate = `Write a prompt to generate an image of: ${action}. 
		The action takes place in ${locationDescription}. Use actor descriptions: ${actors.map((a) => `${a.title} — ${a.description}`).join('; ')}.
		The image should be stylized to resemble early Russian and Norwegian illustrated folk tales. Use thick, inky outlines and flat, muted watercolor washes with earthy tones.
		The characters are stylized but anatomically sound, with strong silhouettes and expressive features.
		The background should be minimal or consist of patterned elements such as stone, fabric, or carved walls to keep the attention on the characters.`;

		const chatResponse = await axios.post(
			OPENAI_CHAT_URL,
			{
				model: 'gpt-4o',
				messages: [{ role: 'user', content: promptGenerate }],
				temperature: 0.7,
			},
			{
				headers: getHeaders(apiKey),
			}
		);

		const imagePrompt = chatResponse.data.choices?.[0]?.message?.content?.trim();

		const response = await axios.post(
			OPENAI_IMAGE_URL,
			{
				model: 'dall-e-3',
				prompt: imagePrompt,
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
