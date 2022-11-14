import { ServerResponse } from "@ocr-translate/shared";

const CALL_PREFIX = `http://localhost:${PORT}/api/`;

class API {
	static async call<T>(endpoint: string, fetchOptions?: RequestInit): Promise<T> {
		const controller = new AbortController();
		setTimeout(() => controller.abort(), 10000);

		const response = await fetch(API.resolvePath(endpoint), {
			...(fetchOptions || {}),
			headers: {
				"Content-Type": `application/json`,
				...(fetchOptions?.headers || {}),
			},
			signal: controller.signal,
		});

		const reply = (await response.json()) as ServerResponse<T>;

		if (typeof reply !== `object` || reply === null) throw new Error(`Unexpected server response`);

		if (reply.status !== 0) throw new Error(typeof reply.error === `string` ? reply.error : `Server returned status code ` + reply.status);

		// Usually here would be where we verify the data is actually what we want,
		// but since it's our server, it's unlikely that it won't be what we're looking for

		return reply.data as T;
	}

	static callPost<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
		return this.call<T>(endpoint, { method: `post`, body: data ? JSON.stringify(data) : null });
	}

	static resolvePath(endpoint: string): string {
		return CALL_PREFIX + endpoint;
	}
}

export default API;
