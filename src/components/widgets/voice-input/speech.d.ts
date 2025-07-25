declare global {
	interface Window {
		webkitSpeechRecognition: typeof SpeechRecognition;
		SpeechRecognition: typeof SpeechRecognition;
	}

	interface SpeechRecognition extends EventTarget {
		lang: string;
		interimResults: boolean;
		maxAlternatives: number;
		start(): void;
		stop(): void;
		abort(): void;
		onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
		onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
		onend: ((this: SpeechRecognition, ev: Event) => any) | null;
		onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
		onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
		onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
		onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
		onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
		onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
		onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
		onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
	}

	interface SpeechRecognitionEvent extends Event {
		readonly results: SpeechRecognitionResultList;
	}

	interface SpeechRecognitionResultList {
		[index: number]: SpeechRecognitionResult;
		length: number;
	}

	interface SpeechRecognitionResult {
		[index: number]: SpeechRecognitionAlternative;
		length: number;
		isFinal: boolean;
	}

	interface SpeechRecognitionAlternative {
		transcript: string;
		confidence: number;
	}

	interface SpeechRecognitionErrorEvent extends Event {
		error: string;
		message: string;
	}
}

export {};
