import { Pool } from "pg";
require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
	host: "ec2-99-81-177-233.eu-west-1.compute.amazonaws.com",
	port: 5432,
	user: "dfucnpmppfvlod",
	password: "c04597e72f7d61cf9b7ac8fa60d2a31b57d8adeed9754735fe170a2ffd87dbc5",
	database: "df2quvva25kmep",
	connectionTimeoutMillis: 5000,
});

export const connectDb = async () => {
	let client;
	try {
		client = await pool.connect();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
	console.log("Postgres connected to", client.database);
	client.release();
};

export const disconnectDb = () => pool.close();

export default { query: pool.query.bind(pool) };
