import { ServerResponse } from "@ocr-translate/shared";

export function generateResponse<T>(data: T): ServerResponse<T> {
	return {
		status: 0,
		data,
	};
}

export function generateErrorResponse(error: unknown): ServerResponse<null> {
	console.error(error);

	return {
		status: 1,
		error: error instanceof Error ? error.message : String(error),
	};
}
