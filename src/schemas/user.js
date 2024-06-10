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
};

export default {
	login(req, res, next) {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		return next();
	},
	logout(next) {
		return next();
	},
	remove: schema.find,
	create: schema.create,
	update: {
		params: schema.find.params,
		body: schema.create.body,
	},
};
