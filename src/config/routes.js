import { Router } from "express";

import { AuthMiddleware } from "@middlewares";
import { UserRoutes } from "@routes";

export default class Routes {
	constructor() {
		this.routes = new Router();

		this.userRoutes = new UserRoutes();
	}

	setup() {
		this.routes.get("/health", (req, res) => res.status(200).send("OK"));
		this.routes.use("/users", this.userRoutes.setup());

		return this.routes;
	}
}
