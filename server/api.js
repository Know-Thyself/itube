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

router.post("/questions", async (req, res) => {
	const category = req.body.category;
	const title = req.body.title;
	const question_content = req.body.question_content;
	const asked_by = req.body.asked_by;
	const ts = new Date().toString();
	const questionInsertQuery =
		"INSERT INTO questions (category, title, question_content, asked_by, ts) VALUES ($1, $2, $3, $4)";
	try {
		await db.query(questionInsertQuery, [category, title, question_content, asked_by, ts]);
		res.json({
			Success: `Your question is successfully posted!`,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;
