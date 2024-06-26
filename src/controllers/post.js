import BaseController from "./base";
import { PostService } from "@services";

class PostController extends BaseController {
	constructor() {
		super();

		this.postService = new PostService();

		this.bindActions([
			"create",
			"get",
			"list",
			"update",
			"remove",
			"like",
			"dislike",
		]);
	}

	async get(req, res) {
		try {
			const response = await this.postService.get({
				id: req.filter.id,
				logged_user_id: req.auth?.id,
			});
			this.successHandler(response, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async create(req, res) {
		try {
			const response = await this.postService.create({
				title: req.data.title,
				content: req.data.content,
				user_id: req.auth.id,
			});
			this.successHandler(response, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async list(req, res) {
		try {
			const response = await this.postService.list({
				meta: {
					page: req.filter.page,
				},
				filter: {
					logged_user_id: req.auth?.id,
				},
			});
			this.successHandler(response, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async update(req, res) {
		try {
			await this.postService.update({
				changes: req.data,
				filter: {
					...req.filter,
					logged_user_id: req.auth.id,
				},
			});
			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async remove(req, res) {
		try {
			await this.postService.delete({
				id: req.filter.id,
				logged_user_id: req.auth.id,
			});

			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async like(req, res) {
		try {
			await this.postService.like({
				filter: {
					post_id: req.filter.id,
					logged_user_id: req.auth.id,
				},
			});

			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}

	async dislike(req, res) {
		try {
			await this.postService.dislike({
				filter: {
					post_id: req.filter.id,
					logged_user_id: req.auth.id,
				},
			});

			this.successHandler(true, res);
		} catch (error) {
			this.errorHandler(error, req, res);
		}
	}
}

export default PostController;
