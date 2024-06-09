import * as yup from "yup";

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
	create: schema.create,
	update: {
		params: schema.find.params,
		body: schema.create.body,
	},
};
