import { Router } from "express";
const router = Router();

router.get("/", (_, res) => {
	res.json({ message: "Hello, world!" });
});

const questionsQuery = "SELECT * FROM questions";

router.get("/questions", async (req, res) => {
		try {
			const result = await pool.query(questionsQuery);
			res.json(result.rows);
		} catch (error) {
			res.status(500).send(error);
		}
});

export default router;
