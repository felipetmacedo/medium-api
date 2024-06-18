import { Post, PostLike } from "../models/index";
import { PaginationUtils } from "../utils";

class PostService {
	create(post) {
		return Post.create(post);
	}

	get(filter) {
		const promises = [];
		const scopes = [];
		if (filter.logged_user_id) {
			scopes.push({
				name: "withUserLike",
				options: filter.logged_user_id,
			});
		}

		promises.push(
			Post.scope(scopes).findOne({
				where: {
					id: filter.id,
				},
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

		return Promise.all(promises);
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

	async like({ filter }) {
		const transaction = await Post.sequelize.transaction();
		try {
			const post = await Post.findOne({
				where: {
					id: filter.post_id,
				},
				transaction,
			});

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await PostLike.findOne({
				where: {
					post_id: filter.post_id,
					user_id: filter.logged_user_id,
				},
				transaction,
			});

			if (hasLike) {
				throw new Error("Post already liked");
			}

			await PostLike.create(
				{
					post_id: filter.post_id,
					user_id: filter.logged_user_id,
				},
				{ transaction }
			);

			await Post.increment("total_likes", {
				where: {
					id: filter.post_id,
				},
				by: 1,
				transaction,
			});

			await transaction.commit();
			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async dislike({ filter }) {
		const transaction = await Post.sequelize.transaction();
		try {
			const post = await Post.findOne({
				where: {
					id: filter.post_id,
				},
				transaction,
			});

			if (!post) {
				throw new Error("Post not found");
			}

			const hasLike = await PostLike.findOne({
				where: {
					post_id: filter.post_id,
					user_id: filter.logged_user_id,
				},
				transaction,
			});

			if (!hasLike) {
				throw new Error("Post not liked");
			}

			await PostLike.destroy({
				where: {
					post_id: filter.post_id,
					user_id: filter.logged_user_id,
				},
				transaction,
			});

			await Post.decrement("total_likes", {
				where: {
					id: filter.post_id,
				},
				by: 1,
				transaction,
			});

			await transaction.commit();
			return post;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}

export default PostService;
