import * as express from "express";
import { generateErrorResponse } from "./utils/response";

import OCRRouter from "./ocr/router";

const app = express();

app.use(
	express.json({
		limit: `5mb`,
	}),
);

app.use(`/api/ocr`, OCRRouter);

app.use((_, res) => {
	res.status(404).send(generateErrorResponse(`Not found`));
});

const port = process.env.port || 45490;
const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/api`);
});
server.on(`error`, console.error);
