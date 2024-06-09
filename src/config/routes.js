import { Router } from "express";

import { AuthMiddleware } from "@middlewares";

export default class Routes {
	constructor() {
		this.routes = new Router();
	}

	setup() {
		this.routes.get("/health", (req, res) => res.status(200).send("OK"));

		return this.routes;
	}
}
