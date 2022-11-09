interface OCRService {
	isReady: boolean;

	recognize(image: Buffer, language: string): Promise<string>;
}

export default OCRService;
