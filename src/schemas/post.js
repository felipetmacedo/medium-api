import * as yup from "yup";

const schema = {
	create: {
		body: yup
			.object({
				title: yup.string().required(),
				content: yup.string().required(),
			})
			.noUnknown(),
	},
	find: {
		params: yup
			.object({
				id: yup.number().required(),
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
};

export default {
	find: schema.find,
	list: schema.list,
	remove: schema.find,
	create: schema.create,
	update: {
		params: schema.find.params,
		body: schema.create.body,
	},
};
