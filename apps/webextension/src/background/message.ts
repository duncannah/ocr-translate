export enum MessageType {
	CaptureTabRequest,
	CaptureTabResponse,
	doOCRRequest,
	doOCRResponse,
	HistoryStateUpdated,
	Error,
}

interface Message {
	type: MessageType;
}

export interface CaptureTabRequestMessage extends Message {
	type: MessageType.CaptureTabRequest;
}

export interface CaptureTabResponseMessage extends Message {
	type: MessageType.CaptureTabResponse;
	dataURI: string;
}

export interface doOCRRequestMessage extends Message {
	type: MessageType.doOCRRequest;
	dataURI: string;
	language: string;
}

export interface doOCRResponseMessage extends Message {
	type: MessageType.doOCRResponse;
	text: string;
}

export interface HistoryStateUpdatedMessage extends Message {
	type: MessageType.HistoryStateUpdated;
}

export interface ErrorMessage extends Message {
	type: MessageType.Error;
	error: string;
}

type RequestType = CaptureTabRequestMessage | doOCRRequestMessage;

export type ResponseType<Request extends Message = CaptureTabRequestMessage | doOCRRequestMessage> =
	| (Request extends CaptureTabRequestMessage
			? CaptureTabResponseMessage
			: Request extends doOCRRequestMessage
			? doOCRResponseMessage
			: Request extends HistoryStateUpdatedMessage
			? HistoryStateUpdatedMessage
			: never)
	| ErrorMessage;

export function sendMessageToBackground<Request extends RequestType>(request: Request): Promise<ResponseType<Request>> {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(request, (response) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(response);
			}
		});
	});
}
