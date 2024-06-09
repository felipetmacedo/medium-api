import BaseModel from "./base";

export default class User extends BaseModel {
	static load(sequelize, DataTypes) {
		return super.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				email: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				paranoid: true,
				timestamps: true,
				sequelize: sequelize,
				modelName: "user",
				tableName: "users",
				createdAt: "created_at",
				updatedAt: "updated_at",
			}
		);
	}
}
