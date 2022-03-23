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

router.patch("/questions", async (req, res) => {
	const title = req.body.title;
	const question_content = req.body.question_content;
	const id = req.body.title;
	try { await db.query(
				"UPDATE questions SET title=$1, question_content=$2 WHERE id=$3",
				[title, question_content, id]);
		res.json({
			Success: `Your question is successfully posted!`,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;
