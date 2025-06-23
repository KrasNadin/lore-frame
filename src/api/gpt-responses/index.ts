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
