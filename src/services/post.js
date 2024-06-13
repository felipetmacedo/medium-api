import { Post, PostLike } from "../models/index";

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

	async list({ meta, filter }) {
		const itensPerPage =
			meta.per_page && meta.per_page < 50 ? meta.per_page : 20;
		const page = ~~meta.page || 1;
		const offset = (page - 1) * itensPerPage;
		const promises = [];

		promises.push(
			Post.findAll({
				attributes: ["id", "title", "content", "userId"],
				order: [["id", "DESC"]],
				limit: itensPerPage,
				offset,
				where: filter,
				include: [
					{
						model: PostLike,
						where: {
							user_id: filter.logged_user_id,
							is_deleted: false,
						},
						as: "likes",
						attributes: ["id"],
					},
				],
			})
		);

		if (page === 1) {
			promises.push(
				Post.count({
					where: filter,
				})
			);
		}

		const [posts, totalItems] = await Promise.all(promises);

		const postsWithLikes = posts.map((post) => ({
			...post.get({ plain: true }),
			numberOfLikes: post.likes.length,
		}));

		const resp = {
			items: postsWithLikes,
		};

		if (page === 1) {
			resp.total_items = totalItems;
		}

		return resp;
	}
}

export default PostService;
