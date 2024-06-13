import { log } from "handlebars";
import { Post, PostLike } from "../models/index";
import { PaginationUtils } from "../utils";

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
			logging: true,
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

	async list({ meta }) {
		const Pagination = PaginationUtils.config({
			page: meta.page,
			items_per_page: 20,
		});
		const promises = [];

		const whereCondition = {
			deleted_at: null,
		};

		promises.push(
			Post.findAll({
				...Pagination.getQueryParams(),
				logging: true,
				raw: false,
				where: whereCondition,
			})
		);

		if (Pagination.getPage() === 1) {
			promises.push(
				Post.count({
					where: whereCondition,
				})
			);
		}

		const [posts, totalItems] = await Promise.all(promises);

		return {
			...Pagination.mount(totalItems),
			posts: posts.map((post) => post.get({ plain: true })),
		};
	}
}

export default PostService;
