import { log } from "handlebars";
import { Post, PostLike } from "../models/index";
import { PaginationUtils } from "../utils";
import { filter } from "lodash";

class PostService {
	create(post) {
		return Post.create(post);
	}

	update({ changes, filter }) {
		return Post.update(changes, {
			where: {
				user_id: filter.logged_user_id,
				id: filter.id,
			},
		});
	}

	delete(filter) {
		return Post.destroy({
			where: {
				id: filter.id,
				user_id: filter.logged_user_id,
			},
		});
	}

	async list({ filter, meta }) {
		console.log(filter, meta);
		const promises = [];
		const scopes = [];
		const Pagination = PaginationUtils.config({
			page: meta.page,
			items_per_page: 20,
		});
		if (filter.logged_user_id) {
			scopes.push({
				name: "withUserLike",
				options: filter.logged_user_id,
			});
		}

		promises.push(
			Post.scope(scopes).findAll({
				logging: true,
				...Pagination.getQueryParams(),
				raw: false,
				attributes: [
					"id",
					"user_id",
					"title",
					"content",
					"total_likes",
					"created_at",
				],
			})
		);

		if (Pagination.getPage() === 1) {
			promises.push(Post.count({}));
		}

		const [posts, totalItems] = await Promise.all(promises);

		return {
			...Pagination.mount(totalItems),
			posts,
		};
	}
}

export default PostService;
