import * as express from "express";
import { generateResponse } from "../utils/response";

const router = express.Router();

router.post(`/`, (req, res) => {
	const { dataURI } = req.body as { dataURI: string };

	res.send(generateResponse<string>(`Hello from the server! Length is ${dataURI.length}`));
});

export default router;
