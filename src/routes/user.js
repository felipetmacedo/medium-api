import { UserSchema } from "@schemas";
import { UserController } from "@controllers";
import BaseRoutes from "./base";

export default class AttendanceRoutes extends BaseRoutes {
	constructor() {
		super();
		this.userController = new UserController();
	}

	setup() {
		this.router.post(
			"/login",
			this.SchemaValidator.validate(UserSchema.login),
			this.userController.login
		);
		this.router.post(
			"/",
			this.SchemaValidator.validate(UserSchema.create),
			this.userController.create
		);
		this.router.put(
			"/:id",
			this.SchemaValidator.validate(UserSchema.update),
			this.userController.update
		);
		this.router.delete(
			"/:id",
			this.SchemaValidator.validate(UserSchema.remove),
			this.userController.remove
		);

		return this.router;
	}
}
