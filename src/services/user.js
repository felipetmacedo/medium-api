import { User } from "../models/index";
import { AuthUtils } from "@utils";

class UserService {
	async login(credentials) {
		const { email, password } = credentials;
		const user = await User.findOne({ where: { email } });

		if (!user || !user.verifyPassword(password)) {
			throw new Error("Invalid email or password");
		}

		const token = AuthUtils.generateToken({ userId: user.id });
		return { user, token };
	}

	async create(user) {
		console.log(User);
		const transaction = await User.sequelize.transaction();

		try {
			const userCreated = await User.create(user, { transaction });

			await transaction.commit();

			return userCreated;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async update({ changes, filter }) {
		const transaction = await User.sequelize.transaction();

		try {
			const userUpdated = await User.update(changes, {
				where: filter,
				transaction,
				returning: true,
			});

			await transaction.commit();

			return userUpdated[1][0];
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}

export default UserService;
