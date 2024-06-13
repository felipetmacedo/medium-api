import { Router } from "express";

import { UserRoutes } from "@routes";
import { PostRoutes } from "@routes";
import { AuthMiddleware } from "../middlewares";

export default class Routes {
	constructor() {
		this.routes = new Router();

		this.userRoutes = new UserRoutes();
		this.postRoutes = new PostRoutes();
	}

	setup() {
		this.routes.get("/health", (req, res) => res.status(200).send("OK"));
		this.routes.use("/users", this.userRoutes.setup());
		this.routes.use(
			"/posts",
			AuthMiddleware.isAuthorized,
			this.postRoutes.setup()
		);

		return this.routes;
	}
}
