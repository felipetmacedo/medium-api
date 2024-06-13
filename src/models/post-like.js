import { Model, DataTypes } from "sequelize";

export default class PostLike extends Model {
	static load(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				userId: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "users",
						key: "id",
					},
				},
				postId: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "posts",
						key: "id",
					},
				},
			},
			{
				paranoid: true,
				timestamps: true,
				sequelize,
				modelName: "post_like",
				tableName: "post_likes",
				createdAt: "created_at",
				updatedAt: "updated_at",
				deletedAt: "deleted_at",
			}
		);
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
		this.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
	}
}
