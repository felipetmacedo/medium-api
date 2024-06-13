import { PostSchema } from "@schemas";
import { PostController } from "@controllers";
import { AuthMiddleware } from "@middlewares";
import BaseRoutes from "./base";

export default class PostRoutes extends BaseRoutes {
	constructor() {
		super();
		this.postController = new PostController();
	}

	setup() {
		this.router.post(
			"/",
			this.SchemaValidator.validate(PostSchema.create),
			this.postController.create
		);
		this.router.put(
			"/:id",
			this.SchemaValidator.validate(PostSchema.update),
			this.postController.update
		);
		this.router.delete(
			"/:id",
			this.SchemaValidator.validate(PostSchema.remove),
			this.postController.remove
		);
		this.router.get(
			"/",
			this.SchemaValidator.validate(PostSchema.list),
			this.postController.list
		);

		return this.router;
	}
}
