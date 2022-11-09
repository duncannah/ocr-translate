import * as path from "node:path";
import { promises as fs } from "node:fs";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

import OCR from "../interface";

const TOKEN_PATH = path.join(process.cwd(), `token.json`);
const CREDENTIALS_PATH = path.join(process.cwd(), `credentials.json`);

type GoogleApiClient = ReturnType<typeof google.auth.fromJSON> | Awaited<ReturnType<typeof authenticate>>;

class GoogleOCRService implements OCR {
	private authClient: GoogleApiClient | null = null;
	private drive: ReturnType<typeof google.drive> | null = null;
	private tmpFolderId = ``;

	public isReady = false;

	constructor() {
		this.authorize()
			.then(async (client) => {
				this.authClient = client;

				await this.initDrive();

				this.isReady = true;
			})
			.catch((e) => {
				console.error(`Google OCR service failed: ${e.message}`);
			});
	}

	private getSavedCredentials = async (): Promise<ReturnType<typeof google.auth.fromJSON> | null> => {
		try {
			const content = await fs.readFile(TOKEN_PATH, `utf8`);
			const credentials = JSON.parse(content);
			return google.auth.fromJSON(credentials);
		} catch (err) {
			return null;
		}
	};

	private saveCredentials = async (client: GoogleApiClient) => {
		const content = await fs.readFile(CREDENTIALS_PATH, `utf8`);
		const keys = JSON.parse(content);
		const key = keys.installed || keys.web;
		const payload = JSON.stringify({
			type: `authorized_user`,
			client_id: key.client_id,
			client_secret: key.client_secret,
			refresh_token: client.credentials.refresh_token,
		});
		await fs.writeFile(TOKEN_PATH, payload);
	};

	private authorize = async (): Promise<GoogleApiClient> => {
		const client = await this.getSavedCredentials();
		if (client) return client;

		const newClient = await authenticate({
			scopes: [`https://www.googleapis.com/auth/drive`],
			keyfilePath: CREDENTIALS_PATH,
		});

		if (newClient.credentials) {
			await this.saveCredentials(newClient);
		}
		return newClient;
	};

	private initDrive = async (): Promise<void> => {
		if (!this.authClient) throw new Error(`No auth client`);

		this.drive = google.drive({
			version: `v3`,
			auth: this.authClient,
		});

		const list = await this.drive.files.list({
			q: `name = 'ocr_tmp' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
			fields: `files`,
		});

		if (list.data.files?.length) this.tmpFolderId = list.data.files[0].id ?? ``;
		else {
			const folder = await this.drive.files.create({
				requestBody: {
					name: `ocr_tmp`,
					mimeType: `application/vnd.google-apps.folder`,
				},
				fields: `id`,
			});
			this.tmpFolderId = folder.data.id ?? ``;
		}
	};

	public recognize = async (image: Buffer, language: string): Promise<string> => {
		if (!this.isReady) throw new Error(`Not authorized yet`);
		if (!this.drive) throw new Error(`No drive client`);

		const imageFile = await this.drive.files.create({
			requestBody: {
				name: Date.now().toString(16) + `.jpg`,
				mimeType: `application/vnd.google-apps.document`,
				parents: [this.tmpFolderId],
			},
			media: {
				mimeType: `image/png`,
				body: image,
			},
			ocrLanguage: language,
			fields: `id`,
		});

		const id = imageFile.data.id ?? ``;

		const textFile = await this.drive.files.export({
			fileId: id,
			mimeType: `text/plain`,
		});

		await this.drive.files.delete({
			fileId: id,
		});

		if (typeof textFile.data === `string`) return textFile.data.substring(21);

		return ``;
	};
}

const GoogleOCR = new GoogleOCRService();

export default GoogleOCR;
