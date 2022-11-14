import { ServerResponse } from "@ocr-translate/shared";

export function generateResponse<T>(data: T): ServerResponse<T> {
	return {
		status: 0,
		data,
	};
}

export function generateErrorResponse(error: string): ServerResponse<null> {
	return {
		status: 1,
		error,
	};
}
