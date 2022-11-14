export interface ServerResponse<T> {
	status: number;
	data?: T;
	error?: string;
}
