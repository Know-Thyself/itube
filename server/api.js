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

const isValid = (n) => {
	return !isNaN(n) && n >= 0;
};

router.get("/questions/:id", (req, res) => {
	const id = req.params.id;
	const query = `SELECT * FROM questions WHERE id=${id}`;
	const checkIfExists = `select exists(select 1 from questions where id=${id})`;
	if (!isValid(id)) {
		res.status(400).json({ "Server message": "Invalid id!" });
	} else {
		db.query(checkIfExists).then((result) => {
			const exists = result.rows.map((el) => el.exists);
			let doesExist = exists.pop();
			if (!doesExist) {
				res.status(404).json({
					"Server message": `A customer by the id ${id} does not exist!`,
				});
			} else {
				db.query(query)
					.then((result) => res.json(result.rows))
					.catch((e) => console.error(e));
			}
		});
	}
});

router.patch("/questions", async (req, res) => {
	const title = req.body.title;
	const question_content = req.body.question_content;
	const id = req.body.id;
	let questionUpdateQuery;
	if (title) {
		questionUpdateQuery =
			"UPDATE questions SET title=$1, question_content=$2 WHERE id=$3";
		try {
			await db.query(questionUpdateQuery, [title, question_content, id]);
			res.status(200).send({
				Success: "Your question including the title is successfully updated!",
			});
		} catch (error) {
			res.status(500).send(error);
		}
	} else if (!title) {
		questionUpdateQuery =
			"UPDATE questions SET question_content=$1 WHERE id=$2";
		try {
			await db.query(questionUpdateQuery, [question_content, id]);
			res.status(200).send({
				Success: "Your question is successfully updated!",
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}
});

router.patch("/answers", async (req, res) => {
	const title = req.body.title;
	const answer_content = req.body.answer_content;
	const id = req.body.id;
	let questionUpdateQuery;
	if (title) {
		questionUpdateQuery =
			"UPDATE answers SET title=$1, answer_content=$2 WHERE id=$3";
		try {
			await db.query(questionUpdateQuery, [title, answer_content, id]);
			res.status(200).send({
				Success: "Your answer including the title is successfully updated!",
			});
		} catch (error) {
			res.status(500).send(error);
		}
	} else if (!title) {
		questionUpdateQuery =
			"UPDATE answers SET answer_content=$1 WHERE id=$2";
		try {
			await db.query(questionUpdateQuery, [answer_content, id]);
			res.status(200).send({
				Success: "Your answer is successfully updated!",
			});
		} catch (error) {
			res.status(500).send(error);
		}
	}
});

export default router;
