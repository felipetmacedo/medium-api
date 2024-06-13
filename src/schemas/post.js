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
};

export default {
	find: schema.find,
	remove: schema.find,
	create: schema.create,
	update: {
		params: schema.find.params,
		body: schema.create.body,
	},
};
