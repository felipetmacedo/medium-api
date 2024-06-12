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
			const response = await this.userService.login({
				email: req.data.email,
				password: req.data.password,
			});
			this.successHandler(response, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async create(req, res) {
		try {
			const response = await this.userService.create({
				name: req.data.name,
				email: req.data.email,
				password: req.data.password,
			});
			this.successHandler(response, res);
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
			await this.userService.delete(req.filter);

			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
}

export default UserController;
