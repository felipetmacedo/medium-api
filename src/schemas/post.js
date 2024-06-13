import * as yup from "yup";

const findById = {
	params: yup
		.object({
			id: yup.number().required(),
		})
		.noUnknown(),
};

const schema = {
	create: {
		body: yup
			.object({
				title: yup.string().required(),
				content: yup.string().required(),
			})
			.noUnknown(),
	},
	list: {
		query: yup
			.object({
				page: yup.number().default(1),
			})
			.noUnknown(),
	},
	find: findById,
	remove: findById,
	like: findById,
	dislike: findById,
};

export default {
	like: schema.like,
	dislike: schema.dislike,
	find: schema.find,
	list: schema.list,
	remove: schema.remove,
	create: schema.create,
	update: {
		params: schema.find.params,
		body: schema.create.body,
	},
};
