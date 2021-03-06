import { Router } from "express";
import db from "./db";
const router = Router();

router.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, DELETE, PUT, PATCH"
	);
	res.setHeader("Access-Control-Allow-Headers", "application/json");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.header(
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Methods",
		"Access-Control-Allow-Origin",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
  // res.header("Set-Cookie: cross-site-cookie=whatever; SameSite=None; Secure");
	next();
});

router.get("/", (req, res) => {
	res.json({ message: "Server is ready!" });
});

const videosQuery = "SELECT * FROM videos";
const videosAscQuery = "SELECT * FROM videos ORDER BY rating ASC";
const videosDescQuery = "SELECT * FROM videos ORDER BY rating DESC";

router.get("/videos", async (req, res) => {
	if (!req.query.order) {
		try {
			const result = await db.query(videosQuery);
			res.json(result.rows);
		} catch (error) {
			res.status(500).send(error);
		}
	} else if (req.query.order === "asc") {
		try {
			const result = await db.query(videosAscQuery);
			res.json(result.rows);
		} catch (error) {
			res.status(500).send(error);
		}
	} else if (req.query.order === "desc") {
		try {
			const result = await db.query(videosDescQuery);
			res.json(result.rows);
		} catch (error) {
			res.status(500).send(error);
		}
	}
});

router.post("/videos", (req, res) => {
	let title = req.body.title;
	let url = req.body.url;
	let newVideo = {
		id: Date.now(),
		title: title,
		url: url,
		rating: 0,
		posted: new Date().toString(),
	};
	const regExp =
		/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	const match = url.match(regExp);
	if (title !== "" && match) {
		const newID = newVideo.id;
		const newTitle = newVideo.title;
		const newURL = newVideo.url;
		const newRating = newVideo.rating;
		const newPosted = newVideo.posted;

		const InsertQuery =
			"INSERT INTO videos (id, title, url, rating, posted) VALUES ($1, $2, $3, $4, $5)";
		client
			.query(InsertQuery, [newID, newTitle, newURL, newRating, newPosted])
			.then(() =>
				res.status(201).json({
					Result: "Success!",
					Message: `Your video is successfully uploaded and given a new id: ${Date.now()}!`,
				})
			)
			.catch((err) => console.error(err));
	} else if (title === "") {
		return res.json({
			Result: "failure",
			message: "Title should not be empty!",
		});
	} else if (url === "") {
		return res.status(400).json({
			Result: "failure",
			message: "You have not entered a url!",
		});
	} else if (!match) {
		return res.status(400).json({
			Result: "failure",
			message: "Invalid url!",
		});
	}
});

router.patch("/videos", (req, res) => {
	const updatedRating = req.body.rating;
	const videoID = req.body.id;
	const voteQuery = `UPDATE videos SET rating=${updatedRating} WHERE id=${videoID}`;

	client
		.query(voteQuery)
		.then(() =>
			res.json({
				message: `The vote of the video by the id ${videoID} is successfully updated!`,
			})
		)
		.catch((err) => console.error(err));
});

router.get("/video/:id", async (req, res) => {
	const id = req.params.id;
	const query = `SELECT * FROM videos WHERE id = ${id}`;
	try {
		const result = await client.query(query);
		if (result.rowCount === 1) res.json(result.rows);
		else
			res.status(404).json({
				message: `Video by id: ${id} could not be found!`,
			});
	} catch (error) {
		res.status(500).send(error);
	}
});

router.delete("/video/:id", (req, res) => {
	const id = req.params.id;
	const deleteQuery = `DELETE FROM videos WHERE id=${id}`;
	if (id) {
		client
			.query(deleteQuery)
			.then(() =>
				res.json({
					Server: `A video by the id: ${id} is successfully deleted!`,
				})
			)
			.catch((err) => console.error(err));
	} else
		res.status(404).json({
			Server: `A video by the id: ${id} could not be found!`,
		});
});

export default router;
