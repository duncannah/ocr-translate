import * as express from "express";
import { generateResponse } from "../utils/response";

const router = express.Router();

router.post(`/`, (req, res) => {
	const { dataURI, language } = req.body as { dataURI: string; language: string };

	res.send(generateResponse<string>(`Hello from the server! Length is ${dataURI.length} and language is ${language}`));
});

export default router;
