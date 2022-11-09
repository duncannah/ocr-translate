import * as express from "express";

const router = express.Router();

router.get(`/`, (_, res) => {
	res.send({ message: `Welcome to server!` });
});

export default router;
