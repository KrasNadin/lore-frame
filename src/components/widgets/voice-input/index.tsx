import { AudioOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';

type VoiceInputProps = {
	addVoiceText: (text: string) => void;
	iconSize?: number;
};

export function VoiceInput({ addVoiceText, iconSize = 24 }: VoiceInputProps) {
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const isListening = useRef(false);
	const isRestartEnabled = useRef(false);
	const isSpacePressed = useRef(false);
	const [isActive, setIsActive] = useState(false);
	const isStarting = useRef(false);

	const startListening = () => {
		if (!recognitionRef.current || isListening.current || isStarting.current) return;

		isStarting.current = true;
		isRestartEnabled.current = true;
		try {
			recognitionRef.current.start();
			isListening.current = true;
			setIsActive(true);
		} catch (err) {
			console.warn('SpeechRecognition start error:', err);
		} finally {
			setTimeout(() => {
				isStarting.current = false;
			}, 300);
		}
	};

	const stopListening = () => {
		isRestartEnabled.current = false;
		recognitionRef.current?.stop();
		isListening.current = false;
		setIsActive(false);
	};

	const toggleListening = () => {
		if (isListening.current) {
			stopListening();
		} else {
			startListening();
		}
	};

	useEffect(() => {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) return;

		const recognition = new SpeechRecognition();
		recognition.lang = 'ru-RU';
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const transcript = event.results[0][0].transcript;
			addVoiceText(transcript);
		};

		recognition.onerror = () => {
			isListening.current = false;
			setIsActive(false);
		};

		recognition.onend = () => {
			isListening.current = false;
			setIsActive(false);

			if (isRestartEnabled.current) {
				startListening();
			}
		};

		recognitionRef.current = recognition;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'Tab' && !isSpacePressed.current) {
				e.preventDefault();
				isSpacePressed.current = true;
				startListening();
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === 'Tab') {
				e.preventDefault();
				isSpacePressed.current = false;
				stopListening();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [addVoiceText]);

	return (
		<Tooltip title={isActive ? 'Слушаем...' : 'Нажми на кнопку или зажми tab'}>
			<AudioOutlined
				onClick={toggleListening}
				style={{
					fontSize: iconSize,
					color: isActive ? '#1890ff' : 'inherit',
					cursor: 'pointer',
					transition: 'color 0.3s',
				}}
			/>
		</Tooltip>
	);
}
