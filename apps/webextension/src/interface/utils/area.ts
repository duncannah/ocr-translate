import { Area } from "@ocr-translate/shared";
import { MessageType, sendMessageToBackground } from "../../background/message";
import { cropDataURI } from "./canvas";

export interface AreaContainer {
	id: number;
	area: Area;
	error?: string;
}

export function OCROnArea(area: Area): [Promise<string>, Promise<string>] {
	const capturePromise = (async () => {
		const resp = await sendMessageToBackground({
			type: MessageType.CaptureTabRequest,
		});

		if (resp.type === MessageType.Error) throw new Error(`Failed to capture tab: ${resp.error}`);

		return resp.dataURI;
	})();

	const ocrPromise = capturePromise.then(async (dataURI) => {
		const croppped = await cropDataURI(dataURI, area.x, area.y, area.width, area.height);

		const resp = await sendMessageToBackground({
			type: MessageType.doOCRRequest,
			dataURI: croppped,
		});

		if (resp.type === MessageType.Error) throw new Error(`Failed to do OCR: ${resp.error}`);

		return resp.text;
	});

	return [capturePromise, ocrPromise];
}
