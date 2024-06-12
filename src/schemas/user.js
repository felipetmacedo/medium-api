import * as yup from "yup";

const schema = {
	create: {
		body: yup
			.object({
				name: yup.string().required(),
				email: yup.string().email().required(),
				password: yup.string().required(),
			})
			.noUnknown(),
	},
	find: {
		params: yup.object({
			id: yup.number().required(),
		}),
	},
	login: {
		body: yup
			.object({
				email: yup.string().email().required(),
				password: yup.string().required(),
			})
			.noUnknown(),
	},
};

export default {
	login: schema.login,
	remove: schema.find,
	create: schema.create,
	update: {
		params: schema.find.params,
		body: schema.create.body,
	},
};
