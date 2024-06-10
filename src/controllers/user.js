import BaseController from "./base";
import { UserService } from "@services";

class UserController extends BaseController {
	constructor() {
		super();

		this.userService = new UserService();

		this.bindActions(["login", "create", "update", "remove"]);
	}

	async login(req, res) {
		try {
			const { email, password } = req.data;
			const { user, token } = await this.userService.login({
				email,
				password,
			});
			this.successHandler({ user, token }, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async create(req, res) {
		try {
			const user = await this.userService.create(req.data);
			this.successHandler(user, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async update(req, res) {
		try {
			await this.userService.update({
				changes: req.data,
				filter: req.filter,
			});
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async remove(req, res) {
		try {
			await this.userService.update({
				changes: {
					is_deleted: true,
					destroyer_id: req.filter.logged_user_id,
				},
				filter: req.filter,
			});
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
}

export default UserController;
