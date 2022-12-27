import * as express from "express";
import GoogleOCR from "./services/google";

import { generateResponse, generateErrorResponse } from "../utils/response";
import { Readable } from "stream";

const router = express.Router();

router.post(`/`, async (req, res) => {
	const { dataURI, language } = req.body as { dataURI: string; language: string };

	try {
		const str = GoogleOCR.recognize(Readable.from(Buffer.from(dataURI.split(`,`)[1], `base64`)), language);
		res.send(generateResponse<string>(await str));
	} catch (e) {
		res.send(generateErrorResponse(e));
	}
});

export default router;
