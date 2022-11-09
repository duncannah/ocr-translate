import * as express from "express";

import OCRRouter from "./ocr/router";

const app = express();

app.use(`/ocr`, OCRRouter);

app.use((_, res) => {
	res.status(404).send({ message: `Not Found` });
});

const port = process.env.port || 45490;
const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/api`);
});
server.on(`error`, console.error);
