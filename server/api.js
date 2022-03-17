import { Router } from "express";
import db from "./db";
const router = Router();

router.get("/", (_, res) => {
	res.json({ message: "Hello, world!" });
});

const questionsQuery = "SELECT * FROM questions";
const answersQuery = "SELECT * FROM answers";

router.get("/questions", async (req, res) => {
		try {
			const result = await db.query(questionsQuery);
			res.json(result.rows);
		} catch (error) {
			res.status(500).send(error);
		}
});

router.get("/answers", async (req, res) => {
	try {
		const result = await db.query(answersQuery);
		res.json(result.rows);
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;
