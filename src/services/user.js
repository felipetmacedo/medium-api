import { User } from "../models/index";
import { AuthUtils } from "@utils";
import { pick } from "lodash";
import ExceptionUtils from "@utils";
import bcrypt from "bcrypt";

class UserService {
	async login(credentials) {
		const { email, password } = credentials;
		const user = await User.findOne({
			where: { email },
			attributes: ["id", "email", "password"],
		});

		if (!user || !this.isValidPassword(password, user.password)) {
			throw new ExceptionUtils("NOT_FOUND");
		}

		const token = AuthUtils.generateToken({ id: user.id });
		return { user: pick(user, ["id", "email", "name"]), token };
	}

	async create(user) {
		const transaction = await User.sequelize.transaction();

		try {
			user.password = await bcrypt.hash(user.password, 10);

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
			if (changes.password) {
				changes.password = await bcrypt.hash(changes.password, 10);
			}

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

	async delete(filter) {
		const transaction = await User.sequelize.transaction();

		try {
			const userDeleted = await User.destroy({
				where: filter,
				transaction,
			});

			await transaction.commit();

			return userDeleted;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	isValidPassword(password, hashedPassword) {
		return bcrypt.compareSync(password, hashedPassword);
	}
}

export default UserService;
